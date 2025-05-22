const {
  MedicalService,
  Patient,
  Doctor,
  MedicalServiceSchedule,
  HospitalMedicalService,
  MedicalServiceInfo,
  Hospital,
} = require("../models/models");
const ApiError = require("../error/ApiError");
const generateMedicalServicePdf = require("../utils/generateMedicalServicePdf");
const { Op } = require("sequelize");

class MedicalServiceController {
  // 🧾 All records (Admin / Doctor only)
    async getAll(req, res, next) {
    try {
      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(ApiError.forbidden("Недостатньо прав для перегляду всіх процедур"));
      }

      const items = await MedicalService.findAll({
        include: [
          {
            model: Patient,
            include: [Hospital],
          },
          {
            model: Doctor,
            include: [Hospital],
          },
          {
            model: MedicalServiceSchedule,
            include: {
              model: HospitalMedicalService,
              include: [Hospital, MedicalServiceInfo, Doctor],
            },
          },
        ],
      });

      const formatted = items.map((item) => {
        const schedule = item.MedicalServiceSchedule;
        const hospitalService = schedule?.HospitalMedicalService;
        const procedure = hospitalService?.MedicalServiceInfo;
        return {
          ...item.toJSON(),
          procedure_name: procedure?.name || null,
          procedure_description: procedure?.description || null,
          procedure_price: procedure?.price || null,
          hospital: hospitalService?.Hospital?.name || null,
          doctor: `${hospitalService?.Doctor?.first_name || ''} ${hospitalService?.Doctor?.last_name || ''}`.trim(),
        };
      });

      return res.json(formatted);
    } catch (e) {
      console.error("getAll error:", e);
      return next(ApiError.internal("Не вдалося отримати список процедур"));
    }
  }

  async getById(req, res, next) {
    try {
      const service = await MedicalService.findByPk(req.params.id, {
        include: [
          {
            model: Patient,
            include: [Hospital],
          },
          {
            model: Doctor,
            include: [Hospital],
          },
          {
            model: MedicalServiceSchedule,
            include: {
              model: HospitalMedicalService,
              include: [Hospital, MedicalServiceInfo, Doctor],
            },
          },
        ],
      });

      if (!service) {
        return next(ApiError.notFound("Процедуру не знайдено"));
      }

      const hospitalService = service.MedicalServiceSchedule?.HospitalMedicalService;
      const procedure = hospitalService?.MedicalServiceInfo;

      return res.json({
        ...service.toJSON(),
        procedure_name: procedure?.name || null,
        procedure_description: procedure?.description || null,
        procedure_price: procedure?.price || null,
        hospital: hospitalService?.Hospital?.name || null,
        doctor: `${hospitalService?.Doctor?.first_name || ''} ${hospitalService?.Doctor?.last_name || ''}`.trim(),
      });
    } catch (e) {
      console.error("getById error:", e);
      return next(ApiError.internal("Помилка отримання процедури"));
    }
  }

  async getByPatient(req, res, next) {
    try {
      const { patientId } = req.params;

      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({ where: { user_id: req.user.id } });
        if (!patient || patient.id !== parseInt(patientId)) {
          return next(ApiError.forbidden("Немає доступу до чужих процедур"));
        }
      }

      const items = await MedicalService.findAll({
        where: { patient_id: patientId },
        include: [
          { model: Doctor, include: [Hospital] },
          {
            model: MedicalServiceSchedule,
            include: {
              model: HospitalMedicalService,
              include: [Hospital, MedicalServiceInfo, Doctor],
            },
          },
        ],
      });

      const result = items.map((s) => {
        const service = s.MedicalServiceSchedule?.HospitalMedicalService;
        const procedure = service?.MedicalServiceInfo;
        const isPrivate = service?.Hospital?.type === "Приватна";

        return {
          ...s.toJSON(),
          procedure_name: procedure?.name || null,
          procedure_description: procedure?.description || null,
          ...(isPrivate && { procedure_price: procedure?.price || null }),
          hospital: service?.Hospital?.name || null,
          doctor: `${service?.Doctor?.first_name || ""} ${service?.Doctor?.last_name || ""}`.trim(),
        };
      });

      res.json(result);
    } catch (e) {
      console.error("getByPatient error:", e);
      next(ApiError.internal("Не вдалося отримати процедури пацієнта"));
    }
  }

  async getByDoctor(req, res, next) {
    try {
      const doctorId = parseInt(req.params.doctorId);
      if (isNaN(doctorId)) {
        return next(ApiError.badRequest("Некоректний ID лікаря"));
      }

      const services = await MedicalService.findAll({
        where: { doctor_id: doctorId },
        include: [
          { model: Patient, attributes: ["first_name", "last_name"] },
          {
            model: MedicalServiceSchedule,
            attributes: ["appointment_date", "start_time", "end_time"],
            include: {
              model: HospitalMedicalService,
              include: [Hospital, MedicalServiceInfo],
            },
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const result = services.map((s) => {
        const service = s.MedicalServiceSchedule?.HospitalMedicalService;
        const procedure = service?.MedicalServiceInfo;
        const isPrivate = service?.Hospital?.type === "Приватна";
        const patient = s.Patient;

        return {
          id: s.id,
          patient_name: `${patient?.first_name || ""} ${patient?.last_name || ""}`.trim(),
          procedure_name: procedure?.name || null,
          procedure_description: procedure?.description || null,
          ...(isPrivate && { procedure_price: procedure?.price || null }),
          appointment_date: s.MedicalServiceSchedule?.appointment_date,
          start_time: s.MedicalServiceSchedule?.start_time,
          end_time: s.MedicalServiceSchedule?.end_time,
          hospital: service?.Hospital?.name || null,
          is_ready: s.is_ready,
        };
      });

      res.json(result);
    } catch (e) {
      console.error("getByDoctor error:", e);
      next(ApiError.internal("Не вдалося отримати записи для лікаря"));
    }
  }
  // ➕ Create
  async create(req, res, next) {
    try {
      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(ApiError.forbidden("Недостатньо прав для створення"));
      }

      const created = await MedicalService.create(req.body);
      return res.status(201).json(created);
    } catch (e) {
      console.error("create error:", e);
      return next(ApiError.badRequest("Не вдалося створити процедуру"));
    }
  }

  // ✏️ Update
  async update(req, res, next) {
    try {
      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(ApiError.forbidden("Недостатньо прав для оновлення"));
      }

      const item = await MedicalService.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Процедуру не знайдено"));

      await item.update(req.body);
      return res.json(item);
    } catch (e) {
      console.error("update error:", e);
      return next(ApiError.internal("Помилка оновлення"));
    }
  }

  // 🗑 Delete
  async delete(req, res, next) {
    try {
      if (req.user.role !== "Admin") {
        return next(ApiError.forbidden("Недостатньо прав для видалення"));
      }

      const item = await MedicalService.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Процедуру не знайдено"));

      await item.destroy();
      return res.json({ message: "Процедуру видалено" });
    } catch (e) {
      console.error("delete error:", e);
      return next(ApiError.internal("Помилка видалення"));
    }
  }

  // 📄 PDF download
  async downloadPDF(req, res, next) {
    try {
      const { id } = req.params;

      const service = await MedicalService.findByPk(id, {
        include: [
          {
            model: Patient,
            include: [Hospital],
          },
          {
            model: Doctor,
            include: [Hospital],
          },
        ],
      });

      if (!service) return next(ApiError.notFound("Процедуру не знайдено"));

      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({ where: { user_id: req.user.id } });
        if (!patient || patient.id !== service.patient_id) {
          return next(ApiError.forbidden("Немає доступу до цієї процедури"));
        }
      }

      await generateMedicalServicePdf(service, res);
    } catch (e) {
      console.error("downloadPDF error:", e);
      return next(ApiError.internal("Не вдалося згенерувати PDF"));
    }
  }

  // ✅ Mark service as ready
  async markReadyStatus(req, res, next) {
    try {
      const { id } = req.params;

      const service = await MedicalService.findByPk(id);
      if (!service) return next(ApiError.notFound("Процедуру не знайдено"));

      await service.update({ is_ready: true });

      return res.json({ message: "Процедуру позначено як завершену" });
    } catch (e) {
      console.error("markReadyStatus error:", e);
      return next(ApiError.internal("Не вдалося оновити статус процедури"));
    }
  }
}

module.exports = new MedicalServiceController();
