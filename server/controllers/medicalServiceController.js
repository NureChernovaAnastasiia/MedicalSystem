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
            include: [
              {
                model: HospitalMedicalService,
                include: [
                  {
                    model: MedicalServiceInfo,
                    as: "MedicalServiceInfo",
                  },
                ],
              },
            ],
          },
        ],
      });

      return res.json(items);
    } catch (e) {
      console.error("getAll error:", e);
      return next(ApiError.internal("Не вдалося отримати список процедур"));
    }
  }

  // 🧾 One by ID
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
            include: [
              {
                model: HospitalMedicalService,
                include: [
                  {
                    model: MedicalServiceInfo,
                    as: "MedicalServiceInfo",
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!service) {
        return next(ApiError.notFound("Процедуру не знайдено"));
      }

      return res.json(service);
    } catch (e) {
      console.error("getById error:", e);
      return next(ApiError.internal("Помилка отримання процедури"));
    }
  }

  // 👤 By patient
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
          {
            model: Doctor,
            include: [Hospital],
          },
          {
            model: MedicalServiceSchedule,
            include: [
              {
                model: HospitalMedicalService,
                include: [
                  {
                    model: MedicalServiceInfo,
                    as: "MedicalServiceInfo",
                    attributes: ["id", "name", "description"],
                  },
                ],
              },
            ],
          },
        ],
      });

      return res.json(items);
    } catch (e) {
      console.error("getByPatient error:", e);
      return next(ApiError.internal("Не вдалося отримати процедури пацієнта"));
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
