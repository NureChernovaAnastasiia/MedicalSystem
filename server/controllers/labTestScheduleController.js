const {
  Patient,
  Appointment,
  HospitalLabService,
  Hospital,
  LabTestInfo,
  Doctor,
  LabTestSchedule,
  LabTest,
} = require("../models/models");
const ApiError = require("../error/ApiError");
const moment = require("moment");
const paypalService = require("../services/paypalService");

class LabTestScheduleController {
  // 🔍 Get all schedules (All authenticated users)
  async getAll(req, res, next) {
    try {
      if (!["Admin", "Doctor", "Patient"].includes(req.user.role)) {
        return next(
          ApiError.forbidden("Недостатньо прав для перегляду розкладів")
        );
      }

      const schedules = await LabTestSchedule.findAll({
        include: {
          model: HospitalLabService,
          include: [Hospital, LabTestInfo, Doctor],
        },
      });

      const formatted = schedules.map((schedule) => {
        const service = schedule.HospitalLabService;
        const hospital = service?.Hospital;
        const isPrivate = hospital?.type === "Приватна";

        return {
          id: schedule.id,
          date: schedule.appointment_date,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          is_booked: schedule.is_booked,
          hospital: hospital?.name,
          test_name: service?.LabTestInfo?.name,
          doctor: `${service?.Doctor?.first_name || ""} ${
            service?.Doctor?.last_name || ""
          }`,
          ...(isPrivate && { test_price: service?.LabTestInfo?.price }),
        };
      });

      return res.json(formatted);
    } catch (e) {
      console.error("getAll error:", e);
      return next(
        ApiError.internal("Не вдалося отримати список розкладів аналізів")
      );
    }
  }

  // 🔍 Get schedule by ID (All authenticated users)
  async getById(req, res, next) {
    try {
      if (!["Admin", "Doctor", "Patient"].includes(req.user.role)) {
        return next(
          ApiError.forbidden("Недостатньо прав для перегляду розкладу")
        );
      }

      const item = await LabTestSchedule.findByPk(req.params.id, {
        include: {
          model: HospitalLabService,
          include: [Hospital, LabTestInfo, Doctor],
        },
      });

      if (!item) return next(ApiError.notFound("Розклад аналізу не знайдено"));

      const service = item.HospitalLabService;
      const isPrivate = service?.Hospital?.type === "Приватна";

      return res.json({
        id: item.id,
        date: item.appointment_date,
        start_time: item.start_time,
        end_time: item.end_time,
        is_booked: item.is_booked,
        hospital: service?.Hospital?.name,
        test_name: service?.LabTestInfo?.name,
        doctor: `${service?.Doctor?.first_name || ""} ${
          service?.Doctor?.last_name || ""
        }`,
        ...(isPrivate && { test_price: service?.LabTestInfo?.price }),
      });
    } catch (e) {
      console.error("getById error:", e);
      return next(ApiError.internal("Помилка отримання розкладу аналізу"));
    }
  }

  async create(req, res, next) {
    try {
      if (req.user.role !== "Admin") {
        return next(
          ApiError.forbidden("Тільки адміністратор може створювати розклад")
        );
      }

      const { hospital_lab_service_id, start_date, end_date, time_template } =
        req.body;

      if (
        !hospital_lab_service_id ||
        !start_date ||
        !end_date ||
        !time_template
      ) {
        return next(
          ApiError.badRequest(
            "Необхідно вказати hospital_lab_service_id, start_date, end_date та time_template"
          )
        );
      }

      const schedulesToCreate = [];
      let current = moment(start_date);
      const end = moment(end_date);

      while (current.isSameOrBefore(end, "day")) {
        const dayOfWeek = current.format("dddd"); // e.g. 'Monday'
        const template = time_template[dayOfWeek];

        if (template) {
          const { start_time, end_time } = template;
          const slotStart = moment(
            `${current.format("YYYY-MM-DD")} ${start_time}`,
            "YYYY-MM-DD HH:mm"
          );
          const slotEndLimit = moment(
            `${current.format("YYYY-MM-DD")} ${end_time}`,
            "YYYY-MM-DD HH:mm"
          );

          let slotCurrent = slotStart.clone();
          while (slotCurrent.isBefore(slotEndLimit)) {
            const slotEnd = slotCurrent.clone().add(30, "minutes");
            if (slotEnd.isAfter(slotEndLimit)) break;

            schedulesToCreate.push({
              hospital_lab_service_id,
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

      const created = await LabTestSchedule.bulkCreate(schedulesToCreate);
      return res.status(201).json({
        message: `Успішно створено ${created.length} розкладів`,
        created,
      });
    } catch (e) {
      console.error("create (labTestSchedule) error:", e);
      return next(ApiError.internal("Не вдалося створити розклад аналізів"));
    }
  }

  async payAndBookLabTest(req, res, next) {
    try {
      const {
        lab_test_schedule_id,
        patient_id: bodyPatientId,
        orderId,
      } = req.body;
      const userId = req.user.id;

      const payment = await paypalService.captureOrder(orderId);
      if (payment.status !== "COMPLETED") {
        return next(ApiError.badRequest("Оплата не була підтверджена"));
      }

      const schedule = await LabTestSchedule.findByPk(lab_test_schedule_id);
      if (!schedule) return next(ApiError.notFound("Розклад не знайдено"));
      if (schedule.is_booked) return next(ApiError.badRequest("Час зайнято"));

      let patientId;
      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({
          where: { user_id: req.user.id },
        });
        if (!patient) return next(ApiError.badRequest("Пацієнта не знайдено"));
        patientId = patient.id;
      } else {
        if (!bodyPatientId)
          return next(ApiError.badRequest("Не вказано patient_id"));
        patientId = bodyPatientId;
      }

      const labService = await HospitalLabService.findByPk(
        schedule.hospital_lab_service_id
      );
      if (!labService)
        return next(ApiError.badRequest("Послугу лабораторії не знайдено"));

      const doctor_id = labService.doctor_id;
      const hospital_id = labService.hospital_id;

      const appointment = await Appointment.create({
        patient_id: patientId,
        doctor_id,
        lab_test_schedule_id,
        appointment_date: schedule.appointment_date,
        status: "Scheduled",
      });

      await schedule.update({ is_booked: true });

      await LabTest.create({
        patient_id: patientId,
        doctor_id,
        lab_test_schedule_id,
        results: null,
        notes: null,
        is_ready: false,
      });

      await paypalService.saveUsedOrder(payment, "lab", userId, hospital_id);

      return res.json({
        message: "Бронювання підтверджено після оплати",
        appointment,
      });
    } catch (e) {
      console.error("payAndBookLabTest error:", e);
      return next(
        ApiError.internal(
          e.message || "Не вдалося оплатити та забронювати аналіз"
        )
      );
    }
  }

  // ✏️ Update (Admin or Doctor only)
  async update(req, res, next) {
    try {
      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(ApiError.forbidden("Недостатньо прав для оновлення"));
      }

      const item = await LabTestSchedule.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Розклад аналізу не знайдено"));

      await item.update(req.body);
      return res.json(item);
    } catch (e) {
      console.error("update error:", e);
      return next(ApiError.internal("Помилка оновлення розкладу аналізу"));
    }
  }

  // 🗑 Delete (Admin or Doctor only)
  async delete(req, res, next) {
    try {
      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(ApiError.forbidden("Недостатньо прав для видалення"));
      }

      const item = await LabTestSchedule.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Розклад аналізу не знайдено"));

      await item.destroy();
      return res.json({ message: "Розклад аналізу успішно видалено" });
    } catch (e) {
      console.error("delete error:", e);
      return next(ApiError.internal("Помилка видалення розкладу аналізу"));
    }
  }
  async getByLabAndDate(req, res, next) {
    try {
      const { labServiceId, date } = req.params;

      if (!labServiceId || !date) {
        return next(ApiError.badRequest("Потрібні labServiceId і date"));
      }

      const schedules = await LabTestSchedule.findAll({
        where: {
          hospital_lab_service_id: labServiceId,
          appointment_date: date,
        },
        include: {
          model: HospitalLabService,
          include: [Hospital, LabTestInfo, Doctor],
        },
      });

      return res.json(schedules);
    } catch (e) {
      console.error("getByLabAndDate error:", e);
      return next(ApiError.internal("Не вдалося отримати розклад аналізів"));
    }
  }
  async getWorkingHoursByDate(req, res, next) {
    try {
      const { hospital_lab_service_id, date } = req.params;

      if (!hospital_lab_service_id || !date) {
        return next(
          ApiError.badRequest("Потрібні hospital_lab_service_id і date")
        );
      }

      const slots = await LabTestSchedule.findAll({
        where: {
          hospital_lab_service_id,
          appointment_date: date,
        },
        order: [["start_time", "ASC"]],
      });

      if (slots.length === 0) {
        return res.json({
          hospital_lab_service_id,
          date,
          message: "На цей день немає аналізів",
        });
      }

      return res.json({
        hospital_lab_service_id,
        date,
        start_time: moment(slots[0].start_time, "HH:mm").format("HH:mm:ss"),
        end_time: moment(slots[slots.length - 1].end_time, "HH:mm").format(
          "HH:mm:ss"
        ),
      });
    } catch (e) {
      console.error("getWorkingHoursByDate (LabTest) error:", e);
      return next(ApiError.internal("Не вдалося отримати час для аналізів"));
    }
  }
  // 🔍 Get all lab test schedules by hospital
  async getByHospital(req, res, next) {
    try {
      const { hospitalId } = req.params;

      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(ApiError.forbidden("Недостатньо прав"));
      }

      const schedules = await LabTestSchedule.findAll({
        include: {
          model: HospitalLabService,
          include: [Hospital, LabTestInfo, Doctor],
          where: { hospital_id: hospitalId },
        },
      });

      const formatted = schedules.map((schedule) => {
        const service = schedule.HospitalLabService;
        const hospital = service?.Hospital;
        const isPrivate = hospital?.type === "Приватна";

        return {
          id: schedule.id,
          date: schedule.appointment_date,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          is_booked: schedule.is_booked,
          hospital: hospital?.name,
          test_name: service?.LabTestInfo?.name,
          doctor: `${service?.Doctor?.first_name || ""} ${
            service?.Doctor?.last_name || ""
          }`,
          ...(isPrivate && { test_price: service?.LabTestInfo?.price }),
        };
      });

      return res.json(formatted);
    } catch (e) {
      console.error("getByHospital error:", e);
      return next(ApiError.internal("Не вдалося отримати розклад за лікарнею"));
    }
  }
}

module.exports = new LabTestScheduleController();
