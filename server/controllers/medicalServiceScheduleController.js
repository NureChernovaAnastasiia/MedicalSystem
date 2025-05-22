const {
  Patient,
  Appointment,
  MedicalServiceSchedule,
  HospitalMedicalService,
  Hospital,
  MedicalServiceInfo,
  Doctor,
  MedicalService,
} = require("../models/models");
const ApiError = require("../error/ApiError");
const moment = require("moment");
const paypalService = require("../services/paypalService");

class MedicalServiceScheduleController {
  // 🔍 Отримати всі розклади процедур
  async getAll(req, res, next) {
    try {
      const schedules = await MedicalServiceSchedule.findAll({
        include: {
          model: HospitalMedicalService,
          include: [
              Hospital,
            MedicalServiceInfo,
            Doctor,
          ],
        },
        order: [["appointment_date", "ASC"], ["start_time", "ASC"]],
      });

      const formatted = schedules.map((schedule) => {
        const service = schedule.HospitalMedicalService;
        const hospital = service?.Hospital;
        const isPrivate = hospital?.type === "Приватна";

        return {
          id: schedule.id,
          date: schedule.appointment_date,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          is_booked: schedule.is_booked,
          hospital: hospital?.name,
          procedure_name: service?.MedicalServiceInfo?.name,
          doctor: `${service?.Doctor?.first_name || ""} ${service?.Doctor?.last_name || ""}`.trim(),
          ...(isPrivate && {
            procedure_price: service?.MedicalServiceInfo?.price,
          }),
        };
      });

      return res.json(formatted);
    } catch (e) {
      console.error("getAll error:", e);
      return next(ApiError.internal("Не вдалося отримати список розкладів процедур"));
    }
  }

  // 🔍 Отримати один розклад
  async getById(req, res, next) {
    try {
      const item = await MedicalServiceSchedule.findByPk(req.params.id, {
        include: {
          model: HospitalMedicalService,
          include: [
            Hospital,
            MedicalServiceInfo,
            Doctor,
          ],
        },
      });

      if (!item) return next(ApiError.notFound("Розклад не знайдено"));

      const service = item.HospitalMedicalService;
      const isPrivate = service?.Hospital?.type === "Приватна";

      return res.json({
        id: item.id,
        date: item.appointment_date,
        start_time: item.start_time,
        end_time: item.end_time,
        is_booked: item.is_booked,
        hospital: service?.Hospital?.name,
        procedure_name: service?.MedicalServiceInfo?.name,
        doctor: `${service?.Doctor?.first_name || ""} ${service?.Doctor?.last_name || ""}`.trim(),
        ...(isPrivate && {
          procedure_price: service?.MedicalServiceInfo?.price,
        }),
      });
    } catch (e) {
      console.error("getById error:", e);
      return next(ApiError.internal("Помилка отримання розкладу процедури"));
    }
  }

  async bookMedicalService(req, res, next) {
    try {
      const { medical_service_schedule_id, patient_id: bodyPatientId, orderId } = req.body;
      const userId = req.user.id;

      // 1. Перевірка платежу без створення запису
      const payment = await paypalService.captureOrder(orderId);
      if (payment.status !== "COMPLETED") {
        return next(ApiError.badRequest("Оплата не була підтверджена"));
      }

      // 2. Розклад
      const schedule = await MedicalServiceSchedule.findByPk(medical_service_schedule_id);
      if (!schedule) return next(ApiError.notFound("Розклад процедури не знайдено"));
      if (schedule.is_booked) return next(ApiError.badRequest("Час вже зайнято"));

      // 3. Пацієнт
      let patientId;
      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({ where: { user_id: req.user.id } });
        if (!patient) return next(ApiError.badRequest("Пацієнта не знайдено"));
        patientId = patient.id;
      } else {
        if (!bodyPatientId) return next(ApiError.badRequest("Не вказано patient_id"));
        patientId = bodyPatientId;
      }

      // 4. Лікар та лікарня
      const hospitalService = await HospitalMedicalService.findByPk(schedule.hospital_medical_service_id);
      if (!hospitalService) return next(ApiError.badRequest("Послугу не знайдено"));
      const doctor_id = hospitalService.doctor_id;
      const hospital_id = hospitalService.hospital_id;

      // 5. Створення записів
      const appointment = await Appointment.create({
        patient_id: patientId,
        doctor_id,
        medical_service_schedule_id,
        appointment_date: schedule.appointment_date,
        status: "Scheduled",
      });

      await schedule.update({ is_booked: true });

      await MedicalService.create({
        patient_id: patientId,
        doctor_id,
        medical_service_schedule_id,
        is_ready: false,
        results: null,
        notes: null,
      });

      // 6. Запис платіжної інформації
      await paypalService.saveUsedOrder(payment, "medical", userId, hospital_id);

      return res.json({
        message: "Процедуру заброньовано після оплати",
        appointment,
      });
    } catch (e) {
      console.error("bookMedicalService error:", e);
      return next(ApiError.internal(e.message || "Не вдалося оплатити та забронювати процедуру"));
    }
  }

  // ➕ Створити розклади по шаблону
  async create(req, res, next) {
    try {
      if (req.user.role !== "Admin") {
        return next(ApiError.forbidden("Тільки адміністратор може створювати розклад"));
      }

      const { hospital_medical_service_id, start_date, end_date, time_template } = req.body;

      if (!hospital_medical_service_id || !start_date || !end_date || !time_template) {
        return next(ApiError.badRequest("Необхідно вказати всі обов'язкові поля"));
      }

      const schedulesToCreate = [];
      let current = moment(start_date);
      const end = moment(end_date);

      while (current.isSameOrBefore(end, "day")) {
        const dayOfWeek = current.format("dddd");
        const template = time_template[dayOfWeek];

        if (template) {
          const { start_time, end_time } = template;
          const slotStart = moment(`${current.format("YYYY-MM-DD")} ${start_time}`, "YYYY-MM-DD HH:mm");
          const slotEndLimit = moment(`${current.format("YYYY-MM-DD")} ${end_time}`, "YYYY-MM-DD HH:mm");

          let slotCurrent = slotStart.clone();
          while (slotCurrent.isBefore(slotEndLimit)) {
            const slotEnd = slotCurrent.clone().add(30, "minutes");
            if (slotEnd.isAfter(slotEndLimit)) break;

            schedulesToCreate.push({
              hospital_medical_service_id,
              appointment_date: current.format("YYYY-MM-DD"),
              start_time: slotCurrent.toDate(),
              end_time: slotEnd.toDate(),
              is_booked: false,
            });

            slotCurrent.add(30, "minutes");
          }
        }

        current.add(1, "day");
      }

      const created = await MedicalServiceSchedule.bulkCreate(schedulesToCreate);
      return res.status(201).json({
        message: `Успішно створено ${created.length} розкладів`,
        created,
      });
    } catch (e) {
      console.error("create schedule error:", e);
      return next(ApiError.internal("Не вдалося створити розклад процедур"));
    }
  }

  // ✏️ Оновити
  async update(req, res, next) {
    try {
      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(ApiError.forbidden("Недостатньо прав для оновлення розкладу"));
      }

      const item = await MedicalServiceSchedule.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Розклад не знайдено"));

      await item.update(req.body);
      return res.json(item);
    } catch (e) {
      console.error("update error:", e);
      return next(ApiError.internal("Помилка оновлення розкладу"));
    }
  }

  // 🗑 Видалити
  async delete(req, res, next) {
    try {
      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(ApiError.forbidden("Недостатньо прав для видалення"));
      }

      const item = await MedicalServiceSchedule.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Розклад не знайдено"));

      await item.destroy();
      return res.json({ message: "Розклад процедури успішно видалено" });
    } catch (e) {
      console.error("delete error:", e);
      return next(ApiError.internal("Помилка видалення розкладу"));
    }
  }

  // 🔍 За послугою та датою
  async getByServiceAndDate(req, res, next) {
    try {
      const { medicalServiceId, date } = req.params;

      if (!medicalServiceId || !date) {
        return next(ApiError.badRequest("Потрібні medicalServiceId і date"));
      }

      const schedules = await MedicalServiceSchedule.findAll({
        where: {
          hospital_medical_service_id: medicalServiceId,
          appointment_date: date,
        },
        include: {
          model: HospitalMedicalService,
          include: [
            Hospital,
            MedicalServiceInfo,
            Doctor,
          ],
        },
      });

      return res.json(schedules);
    } catch (e) {
      console.error("getByServiceAndDate error:", e);
      return next(ApiError.internal("Не вдалося отримати розклад процедур"));
    }
  }

  // 🕒 Отримати години роботи на день
  async getWorkingHoursByDate(req, res, next) {
    try {
      const { hospital_medical_service_id, date } = req.params;

      if (!hospital_medical_service_id || !date) {
        return next(ApiError.badRequest("Потрібні hospital_medical_service_id і date"));
      }

      const slots = await MedicalServiceSchedule.findAll({
        where: {
          hospital_medical_service_id,
          appointment_date: date,
        },
        order: [["start_time", "ASC"]],
      });

      if (slots.length === 0) {
        return res.json({
          hospital_medical_service_id,
          date,
          message: "На цей день немає процедур",
        });
      }

      return res.json({
        hospital_medical_service_id,
        date,
        start_time: moment(slots[0].start_time).format("HH:mm:ss"),
        end_time: moment(slots[slots.length - 1].end_time).format("HH:mm:ss"),
      });
    } catch (e) {
      console.error("getWorkingHoursByDate error:", e);
      return next(ApiError.internal("Не вдалося отримати години роботи"));
    }
  }
}

module.exports = new MedicalServiceScheduleController();
