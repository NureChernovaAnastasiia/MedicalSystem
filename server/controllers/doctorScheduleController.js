const {
  DoctorSchedule,
  Appointment,
  Doctor,
  Patient,
  Hospital
} = require("../models/models");
const ApiError = require("../error/ApiError");
const { Op } = require("sequelize");
const moment = require("moment");

class DoctorScheduleController {
  // Усі розклади лікарів (лише Admin)
  async getAll(req, res, next) {
    try {
      if (req.user.role !== "Admin") {
        return next(ApiError.forbidden("Доступ заборонено"));
      }

      const schedules = await DoctorSchedule.findAll({ include: Doctor });
      return res.json(schedules);
    } catch (e) {
      console.error("getAll error:", e);
      return next(ApiError.internal("Не вдалося отримати список розкладів"));
    }
  }

  // Розклад за лікарнею
  async getByHospital(req, res, next) {
    try {
      const { hospitalId } = req.params;
      const schedules = await DoctorSchedule.findAll({
        include: {
          model: Doctor,
          where: { hospital_id: hospitalId },
        },
      });
      return res.json(schedules);
    } catch (e) {
      console.error("getByHospital error:", e);
      return next(ApiError.internal("Не вдалося отримати розклади лікарні"));
    }
  }

  // Розклад конкретного лікаря
  async getByDoctor(req, res, next) {
    try {
      const { doctorId } = req.params;

      if (req.user.role === "Doctor") {
        const doctor = await Doctor.findOne({
          where: { user_id: req.user.id },
        });
        if (!doctor || doctor.id !== parseInt(doctorId)) {
          return next(ApiError.forbidden("Немає доступу до чужого розкладу"));
        }
      }

      const schedules = await DoctorSchedule.findAll({
        where: { doctor_id: doctorId },
      });
      return res.json(schedules);
    } catch (e) {
      console.error("getByDoctor error:", e);
      return next(ApiError.internal("Не вдалося отримати розклад лікаря"));
    }
  }

  // Розклад лікаря на день (публічний)
  async getByDoctorAndDate(req, res, next) {
    try {
      const { doctorId, date } = req.params;
      if (!doctorId || !date)
        return next(ApiError.badRequest("Потрібні doctorId і date"));

      const schedules = await DoctorSchedule.findAll({
        where: {
          doctor_id: doctorId,
          appointment_date: date,
        },
      });

      return res.json(schedules);
    } catch (e) {
      console.error("getByDoctorAndDate error:", e);
      return next(
        ApiError.internal("Не вдалося отримати розклад на вказану дату")
      );
    }
  }

  // Створення (Admin)
  async create(req, res, next) {
    try {
      if (req.user.role !== "Admin") {
        return next(
          ApiError.forbidden("Тільки адміністратор може створювати розклад")
        );
      }

      const { doctor_id, start_date, end_date, schedule_template } = req.body;

      if (!doctor_id || !start_date || !end_date || !schedule_template) {
        return next(
          ApiError.badRequest(
            "Необхідно вказати doctor_id, start_date, end_date та schedule_template"
          )
        );
      }

      const schedulesToCreate = [];

      let current = moment(start_date);
      const end = moment(end_date);

      while (current.isSameOrBefore(end, "day")) {
        const dayOfWeek = current.format("dddd"); // e.g. 'Monday'
        const template = schedule_template[dayOfWeek];

        if (template) {
          const { start_time, end_time } = template;
          const start = moment(
            `${current.format("YYYY-MM-DD")} ${start_time}`,
            "YYYY-MM-DD HH:mm"
          );
          const end = moment(
            `${current.format("YYYY-MM-DD")} ${end_time}`,
            "YYYY-MM-DD HH:mm"
          );

          while (start.isBefore(end)) {
            const slotEnd = moment(start).add(30, "minutes");

            if (slotEnd.isAfter(end)) break;

            schedulesToCreate.push({
              doctor_id,
              appointment_date: current.format("YYYY-MM-DD"),
              start_time: start.format("HH:mm"),
              end_time: slotEnd.format("HH:mm"),
              is_booked: false,
            });

            start.add(30, "minutes");
          }
        }

        current.add(1, "day");
      }

      const created = await DoctorSchedule.bulkCreate(schedulesToCreate);

      return res.json({
        message: `Успішно створено ${created.length} розкладів`,
        created,
      });
    } catch (e) {
      console.error("create (week) error:", e);
      return next(ApiError.internal("Не вдалося створити розклад на тиждень"));
    }
  }
  // Оновлення (Admin)
  async update(req, res, next) {
    try {
      if (req.user.role !== "Admin") {
        return next(
          ApiError.forbidden("Тільки адміністратор може оновлювати розклад")
        );
      }

      const item = await DoctorSchedule.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Розклад не знайдено"));

      await item.update(req.body);
      return res.json(item);
    } catch (e) {
      console.error("update error:", e);
      return next(ApiError.internal("Помилка оновлення розкладу"));
    }
  }

  // Видалення (Admin)
  async delete(req, res, next) {
    try {
      if (req.user.role !== "Admin") {
        return next(
          ApiError.forbidden("Тільки адміністратор може видаляти розклад")
        );
      }

      const item = await DoctorSchedule.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Розклад не знайдено"));

      await item.destroy();
      return res.json({ message: "Розклад видалено" });
    } catch (e) {
      console.error("delete error:", e);
      return next(ApiError.internal("Помилка видалення розкладу"));
    }
  }

  // 🟢 Бронювання слота
  async bookSchedule(req, res, next) {
    try {
      const { scheduleId } = req.params;

      const schedule = await DoctorSchedule.findByPk(scheduleId);
      if (!schedule) return next(ApiError.notFound("Час розкладу не знайдено"));

      if (schedule.is_booked) {
        return next(ApiError.badRequest("Цей час вже заброньований"));
      }

      let patient;
      if (req.user.role === "Patient") {
        patient = await Patient.findOne({ where: { user_id: req.user.id } });
        if (!patient) return next(ApiError.forbidden("Пацієнта не знайдено"));
      } else if (req.body.patient_id) {
        patient = await Patient.findByPk(req.body.patient_id);
        if (!patient) return next(ApiError.badRequest("Невірний patient_id"));
      } else {
        return next(ApiError.badRequest("Необхідно вказати пацієнта"));
      }

      const appointment = await Appointment.create({
        patient_id: patient.id,
        doctor_id: schedule.doctor_id,
        doctor_schedule_id: schedule.id,
        appointment_date: schedule.appointment_date,
        status: "Scheduled",
      });

      await schedule.update({ is_booked: true });

      return res.json({
        message: "Час успішно заброньовано",
        appointment,
      });
    } catch (e) {
      console.error("bookSchedule error:", e);
      return next(ApiError.internal("Не вдалося забронювати час"));
    }
  }
  async getWorkingHoursByDate(req, res, next) {
    try {
      const { doctorId, date } = req.params;

      if (!doctorId || !date) {
        return next(ApiError.badRequest("Потрібні doctorId і date"));
      }

      const slots = await DoctorSchedule.findAll({
        where: {
          doctor_id: doctorId,
          appointment_date: date,
        },
        order: [["start_time", "ASC"]],
      });

      if (slots.length === 0) {
        return res.json({
          doctor_id: doctorId,
          date,
          message: "На цей день немає розкладу",
        });
      }

      return res.json({
        doctor_id: doctorId,
        date,
        start_time: slots[0].start_time,
        end_time: slots[slots.length - 1].end_time,
      });
    } catch (e) {
      console.error("getWorkingHoursByDate error:", e);
      return next(ApiError.internal("Не вдалося отримати час прийому лікаря"));
    }
  }
  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const schedule = await DoctorSchedule.findByPk(id, {
        include: [
          {
            model: Doctor,
            include: [Hospital],
          },
          {
            model: Appointment,
            include: [Patient],
          },
        ],
      });

      if (!schedule) {
        return next(ApiError.notFound("Розклад не знайдено"));
      }

      return res.json(schedule);
    } catch (e) {
      console.error("getById error:", e);
      return next(ApiError.internal("Не вдалося отримати розклад"));
    }
  }
}

module.exports = new DoctorScheduleController();
