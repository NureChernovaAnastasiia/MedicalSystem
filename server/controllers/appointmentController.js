const {
  Appointment,
  Doctor,
  Patient,
  DoctorSchedule,
  Hospital,
  LabTestSchedule,
  MedicalServiceSchedule,
} = require("../models/models");
const ApiError = require("../error/ApiError");
const { Op } = require("sequelize");
const { resolveAndBookSchedule } = require("../utils/scheduleUtils");

class AppointmentController {
  async getAll(req, res, next) {
    try {
      if (req.user.role !== "Admin") {
        return next(ApiError.forbidden("Only admin can view all appointments"));
      }

      const appointments = await Appointment.findAll({
        include: [
          {
            model: Doctor,
            include: [Hospital],
          },
          Patient,
          DoctorSchedule,
          LabTestSchedule,
          MedicalServiceSchedule,
        ],
      });

      return res.json(AppointmentController._mapStatus(appointments));
    } catch (e) {
      console.error("getAll error:", e);
      return next(ApiError.internal("Failed to retrieve appointments"));
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const appointment = await Appointment.findByPk(id, {
        include: [
          {
            model: Doctor,
            include: [Hospital],
          },
          Patient,
          DoctorSchedule,
          LabTestSchedule,
          MedicalServiceSchedule,
        ],
      });

      if (!appointment) return next(ApiError.notFound("Appointment not found"));

      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({
          where: { user_id: req.user.id },
        });
        if (!patient || patient.id !== appointment.patient_id) {
          return next(ApiError.forbidden("Access denied"));
        }
      }

      return res.json(AppointmentController._mapStatus([appointment])[0]);
    } catch (e) {
      console.error("getById error:", e);
      return next(ApiError.internal("Failed to get appointment"));
    }
  }

  async create(req, res, next) {
    try {
      const {
        patient_id,
        doctor_id,
        doctor_schedule_id,
        lab_test_schedule_id,
        medical_service_schedule_id,
        status,
        notes,
      } = req.body;

      if (!patient_id || !doctor_id) {
        return next(
          ApiError.badRequest("Required fields: patient_id, doctor_id")
        );
      }

      if (
        !doctor_schedule_id &&
        !lab_test_schedule_id &&
        !medical_service_schedule_id
      ) {
        return next(
          ApiError.badRequest("One of the schedule IDs must be provided")
        );
      }

      let appointment_date = null;

      if (doctor_schedule_id) {
        appointment_date = await resolveAndBookSchedule(
          "doctor",
          doctor_schedule_id,
          next
        );
      } else if (lab_test_schedule_id) {
        appointment_date = await resolveAndBookSchedule(
          "lab",
          lab_test_schedule_id,
          next
        );
      } else if (medical_service_schedule_id) {
        appointment_date = await resolveAndBookSchedule(
          "service",
          medical_service_schedule_id,
          next
        );
      }

      if (!appointment_date) return; // зупиняємось, якщо next() вже викликав помилку

      const created = await Appointment.create({
        patient_id,
        doctor_id,
        doctor_schedule_id,
        lab_test_schedule_id,
        medical_service_schedule_id,
        appointment_date,
        status: status || "Scheduled",
        notes: notes || null,
      });

      return res.json(created);
    } catch (e) {
      console.error("create error:", e);
      return next(ApiError.internal("Failed to create appointment"));
    }
  }

  async update(req, res, next) {
    try {
      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(ApiError.forbidden("Insufficient permissions"));
      }

      const appointment = await Appointment.findByPk(req.params.id);
      if (!appointment) return next(ApiError.notFound("Appointment not found"));

      await appointment.update(req.body);
      return res.json(appointment);
    } catch (e) {
      console.error("update error:", e);
      return next(ApiError.internal("Failed to update appointment"));
    }
  }

  async cancel(req, res, next) {
    try {
      const appointment = await Appointment.findByPk(req.params.id, {
        include: [
          Doctor,
          Patient,
          DoctorSchedule,
          "LabTestSchedule",
          "MedicalServiceSchedule",
        ],
      });

      if (!appointment) {
        return next(ApiError.notFound("Appointment not found"));
      }

      const { notes } = req.body;

      // 🔐 Доступ для пацієнта до свого запису
      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({
          where: { user_id: req.user.id },
        });

        if (!patient || patient.id !== appointment.patient_id) {
          return next(ApiError.forbidden("Access denied"));
        }

        // Дозволити запис коментаря тільки пацієнту
        if (notes) {
          appointment.notes = notes;
        }
      }

      // Статус та запис
      appointment.status = "Cancelled";
      await appointment.save();

      // Звільнення розкладу, якщо є
      if (appointment.doctor_schedule_id) {
        await DoctorSchedule.update(
          { is_booked: false },
          { where: { id: appointment.doctor_schedule_id } }
        );
      }

      if (appointment.lab_test_schedule_id) {
        const { LabTestSchedule } = require("../models/models");
        await LabTestSchedule.update(
          { is_booked: false },
          { where: { id: appointment.lab_test_schedule_id } }
        );
      }

      if (appointment.medical_service_schedule_id) {
        const { MedicalServiceSchedule } = require("../models/models");
        await MedicalServiceSchedule.update(
          { is_booked: false },
          { where: { id: appointment.medical_service_schedule_id } }
        );
      }

      return res.json({
        message: "Appointment cancelled",
        appointment,
      });
    } catch (e) {
      console.error("cancel error:", e);
      return next(ApiError.internal("Failed to cancel appointment"));
    }
  }

  async getByPatient(req, res, next) {
    try {
      const { patientId } = req.params;

      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({
          where: { user_id: req.user.id },
        });
        if (!patient || patient.id !== parseInt(patientId)) {
          return next(ApiError.forbidden("Access denied"));
        }
      }

      const items = await Appointment.findAll({
        where: { patient_id: patientId },
        include: [
          {
            model: Doctor,
            include: [Hospital],
          },
          DoctorSchedule,
          LabTestSchedule,
          MedicalServiceSchedule,
        ],
      });

      return res.json(AppointmentController._mapStatus(items));
    } catch (e) {
      console.error("getByPatient error:", e);
      return next(ApiError.internal("Failed to retrieve patient appointments"));
    }
  }

  async getByDoctor(req, res, next) {
    try {
      const { doctorId } = req.params;

      if (req.user.role === "Doctor") {
        const doctor = await Doctor.findOne({
          where: { user_id: req.user.id },
        });
        if (!doctor || doctor.id !== parseInt(doctorId)) {
          return next(ApiError.forbidden("Access denied"));
        }
      }

      const appointments = await Appointment.findAll({
        where: { doctor_id: doctorId },
        include: [
          {
            model: Doctor,
            include: [Hospital],
          },
          Patient,
          DoctorSchedule,
          LabTestSchedule,
          MedicalServiceSchedule,
        ],
      });

      return res.json(AppointmentController._mapStatus(appointments));
    } catch (e) {
      console.error("getByDoctor error:", e);
      return next(ApiError.internal("Failed to retrieve doctor appointments"));
    }
  }

  async getUpcomingByDoctor(req, res, next) {
    try {
      const { doctorId } = req.params;

      if (req.user.role === "Doctor") {
        const doctor = await Doctor.findOne({
          where: { user_id: req.user.id },
        });
        if (!doctor || doctor.id !== parseInt(doctorId)) {
          return next(ApiError.forbidden("Access denied"));
        }
      }

      const now = new Date();

      const upcomingAppointments = await Appointment.findAll({
        where: {
          doctor_id: doctorId,
          appointment_date: { [Op.gte]: now },
          status: { [Op.ne]: "Cancelled" },
        },
        include: [
          {
            model: Patient,
            include: [Hospital],
          },
          DoctorSchedule,
          LabTestSchedule,
          MedicalServiceSchedule,
        ],
        order: [["appointment_date", "ASC"]],
      });

      return res.json(AppointmentController._mapStatus(upcomingAppointments));
    } catch (e) {
      console.error("getUpcomingByDoctor error:", e);
      return next(
        ApiError.internal("Failed to retrieve upcoming appointments")
      );
    }
  }
  async getUpcomingByPatient(req, res, next) {
    try {
      const { patientId } = req.params;

      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({
          where: { user_id: req.user.id },
        });
        if (!patient || patient.id !== parseInt(patientId)) {
          return next(ApiError.forbidden("Access denied"));
        }
      }

      const now = new Date();

      const upcomingAppointments = await Appointment.findAll({
        where: {
          patient_id: patientId,
          appointment_date: { [Op.gte]: now },
          status: { [Op.ne]: "Cancelled" },
        },
        include: [
          {
            model: Doctor,
            include: [Hospital],
          },
          DoctorSchedule,
          LabTestSchedule,
          MedicalServiceSchedule,
        ],
        order: [["appointment_date", "ASC"]],
      });

      return res.json(AppointmentController._mapStatus(upcomingAppointments));
    } catch (e) {
      console.error("getUpcomingByPatient error:", e);
      return next(
        ApiError.internal("Failed to retrieve upcoming appointments")
      );
    }
  }

  static _mapStatus(list) {
    const now = new Date();
    return list.map((item) => {
      const date = new Date(item.appointment_date);

      let status;
      if (item.status === "Cancelled") {
        status = "Cancelled";
      } else if (date < now) {
        status = "Past";
      } else {
        status = "Scheduled";
      }

      return { ...item.toJSON(), computed_status: status };
    });
  }
  async markAsCompleted(req, res, next) {
    try {
      const { id } = req.params;

      console.log("✅ markAsCompleted called");
      console.log("📥 req.params.id:", id);
      console.log("🔑 req.user:", req.user);

      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return next(ApiError.notFound("Прийом не знайдено"));
      }

      console.log("📄 appointment.doctor_id:", appointment.doctor_id);

      if (req.user.role === "Doctor") {
        const doctor = await Doctor.findOne({
          where: { user_id: req.user.id },
        });

        console.log("👨‍⚕️ Found doctor:", doctor?.id);

        if (!doctor) {
          return next(ApiError.badRequest("Лікаря не знайдено"));
        }

        if (doctor.id !== appointment.doctor_id) {
          console.log("⛔ Access denied: doctor.id !== appointment.doctor_id");
          return next(ApiError.forbidden("Немає доступу до цього прийому"));
        }
      } else if (req.user.role !== "Admin") {
        console.log("⛔ Access denied: role is not Admin or Doctor");
        return next(
          ApiError.forbidden(
            "Тільки лікар або адміністратор можуть підтвердити прийом"
          )
        );
      }

      // 📝 Оновлення статусу
      appointment.status = "Completed";
      await appointment.save();

      console.log("✅ Appointment marked as completed");

      return res.json({
        message: "Прийом успішно підтверджено як завершений",
        appointment,
      });
    } catch (e) {
      console.error("❌ markAsCompleted error:", e);
      return next(
        ApiError.internal("Не вдалося підтвердити завершення прийому")
      );
    }
  }
}

module.exports = new AppointmentController();
