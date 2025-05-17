const {
  Patient,
  Appointment,
  MedicalServiceSchedule,
  HospitalMedicalService,
  Hospital,
  MedicalServiceInfo,
  Doctor,
} = require("../models/models");
const ApiError = require("../error/ApiError");

class MedicalServiceScheduleController {
  // 🔍 Отримати всі розклади процедур (всі авторизовані)
  async getAll(req, res, next) {
    try {
      const schedules = await MedicalServiceSchedule.findAll({
        include: {
          model: HospitalMedicalService,
          include: [Hospital, MedicalServiceInfo, Doctor],
        },
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
          doctor: `${service?.Doctor?.first_name || ""} ${
            service?.Doctor?.last_name || ""
          }`,
          ...(isPrivate && {
            procedure_price: service?.MedicalServiceInfo?.price,
          }),
        };
      });

      return res.json(formatted);
    } catch (e) {
      console.error("getAll error:", e);
      return next(
        ApiError.internal("Не вдалося отримати список розкладів процедур")
      );
    }
  }

  // 🔍 Отримати один розклад
  async getById(req, res, next) {
    try {
      const item = await MedicalServiceSchedule.findByPk(req.params.id, {
        include: {
          model: HospitalMedicalService,
          include: [Hospital, MedicalServiceInfo, Doctor],
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
        doctor: `${service?.Doctor?.first_name || ""} ${
          service?.Doctor?.last_name || ""
        }`,
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
      const { medical_service_schedule_id, patient_id: bodyPatientId } =
        req.body;

      const schedule = await MedicalServiceSchedule.findByPk(
        medical_service_schedule_id
      );
      if (!schedule)
        return next(ApiError.notFound("Розклад процедури не знайдено"));
      if (schedule.is_booked)
        return next(ApiError.badRequest("Час вже зайнято"));

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

      const doctor_id = (
        await HospitalMedicalService.findByPk(
          schedule.hospital_medical_service_id
        )
      )?.doctor_id;

      const appointment = await Appointment.create({
        patient_id: patientId,
        doctor_id,
        medical_service_schedule_id,
        appointment_date: schedule.appointment_date,
        status: "Scheduled",
      });

      await schedule.update({ is_booked: true });

      return res.json(appointment);
    } catch (e) {
      console.error("bookMedicalService error:", e);
      return next(ApiError.internal("Не вдалося забронювати процедуру"));
    }
  }

  // ➕ Створити (лише Admin або Doctor)
  async create(req, res, next) {
    try {
      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(
          ApiError.forbidden("Недостатньо прав для створення розкладу")
        );
      }

      const created = await MedicalServiceSchedule.create(req.body);
      return res.status(201).json(created);
    } catch (e) {
      console.error("create error:", e);
      return next(ApiError.badRequest("Не вдалося створити розклад процедури"));
    }
  }

  // ✏️ Оновити (лише Admin або Doctor)
  async update(req, res, next) {
    try {
      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(
          ApiError.forbidden("Недостатньо прав для оновлення розкладу")
        );
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

  // 🗑 Видалити (лише Admin або Doctor)
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
          include: [Hospital, MedicalServiceInfo, Doctor],
        },
      });

      return res.json(schedules);
    } catch (e) {
      console.error("getByServiceAndDate error:", e);
      return next(ApiError.internal("Не вдалося отримати розклад процедур"));
    }
  }
}

module.exports = new MedicalServiceScheduleController();
