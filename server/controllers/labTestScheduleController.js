const {
  Patient,
  Appointment,
  HospitalLabService,
  Hospital,
  LabTestInfo,
  Doctor,
  LabTestSchedule,
} = require("../models/models");
const ApiError = require("../error/ApiError");

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

  // ➕ Create (Admin or Doctor only)
  async create(req, res, next) {
    try {
      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(
          ApiError.forbidden("Недостатньо прав для створення розкладу")
        );
      }

      const created = await LabTestSchedule.create(req.body);
      return res.status(201).json(created);
    } catch (e) {
      console.error("create error:", e);
      return next(ApiError.badRequest("Не вдалося створити розклад аналізу"));
    }
  }
  async bookLabTest(req, res, next) {
    try {
      const { lab_test_schedule_id, patient_id: bodyPatientId } = req.body;

      const schedule = await LabTestSchedule.findByPk(lab_test_schedule_id);
      if (!schedule)
        return next(ApiError.notFound("Розклад аналізу не знайдено"));
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
        await HospitalLabService.findByPk(schedule.hospital_lab_service_id)
      )?.doctor_id;

      const appointment = await Appointment.create({
        patient_id: patientId,
        doctor_id,
        lab_test_schedule_id,
        appointment_date: schedule.appointment_date,
        status: "Scheduled",
      });

      await schedule.update({ is_booked: true });

      return res.json(appointment);
    } catch (e) {
      console.error("bookLabTest error:", e);
      return next(ApiError.internal("Не вдалося забронювати аналіз"));
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
}

module.exports = new LabTestScheduleController();
