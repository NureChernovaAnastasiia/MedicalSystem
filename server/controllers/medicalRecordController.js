const { MedicalRecord, Prescription, Patient } = require("../models/models");
const ApiError = require("../error/ApiError");

class MedicalRecordController {
  async getAll(req, res, next) {
    try {
      if (req.user.role !== "Doctor" && req.user.role !== "Admin") {
        return next(
          ApiError.forbidden(
            "Тільки лікар або адміністратор можуть бачити всі медичні записи"
          )
        );
      }

      const items = await MedicalRecord.findAll({ include: [Prescription] });
      return res.json(items);
    } catch (e) {
      console.error("getAll error:", e);
      return next(
        ApiError.internal("Не вдалося отримати список медичних записів")
      );
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const item = await MedicalRecord.findByPk(id, {
        include: [Prescription],
      });
      if (!item) return next(ApiError.notFound("Медичний запис не знайдено"));

      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({
          where: { user_id: req.user.id },
        });
        if (!patient || patient.id !== item.patient_id) {
          return next(ApiError.forbidden("Немає доступу до чужого запису"));
        }
      }

      return res.json(item);
    } catch (e) {
      console.error("getById error:", e);
      return next(ApiError.internal("Помилка отримання медичного запису"));
    }
  }

  async create(req, res, next) {
    try {
      if (req.user.role !== "Doctor" && req.user.role !== "Admin") {
        return next(
          ApiError.forbidden(
            "Тільки лікар або адміністратор можуть створювати записи"
          )
        );
      }

      const created = await MedicalRecord.create(req.body);
      return res.json(created);
    } catch (e) {
      console.error("create error:", e);
      return next(ApiError.badRequest("Не вдалося створити медичний запис"));
    }
  }

  async update(req, res, next) {
    try {
      if (req.user.role !== "Doctor" && req.user.role !== "Admin") {
        return next(
          ApiError.forbidden(
            "Тільки лікар або адміністратор можуть оновлювати записи"
          )
        );
      }

      const item = await MedicalRecord.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Медичний запис не знайдено"));
      await item.update(req.body);
      return res.json(item);
    } catch (e) {
      console.error("update error:", e);
      return next(ApiError.internal("Помилка оновлення медичного запису"));
    }
  }

  async delete(req, res, next) {
    try {
      if (req.user.role !== "Doctor" && req.user.role !== "Admin") {
        return next(
          ApiError.forbidden(
            "Тільки лікар або адміністратор можуть видаляти записи"
          )
        );
      }

      const item = await MedicalRecord.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Медичний запис не знайдено"));
      await item.destroy();
      return res.json({ message: "Медичний запис видалено" });
    } catch (e) {
      console.error("delete error:", e);
      return next(ApiError.internal("Помилка видалення медичного запису"));
    }
  }
  async getPrescriptionsByRecordAndPatient(req, res, next) {
    try {
      const { recordId, patientId } = req.params;

      const medicalRecord = await MedicalRecord.findByPk(recordId, {
        include: [Prescription],
      });

      if (!medicalRecord) {
        return next(ApiError.notFound("Медичний запис не знайдено"));
      }

      // 🔐 Доступ: перевірка на власника запису
      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({
          where: { user_id: req.user.id },
        });

        if (!patient || patient.id !== parseInt(patientId)) {
          return next(ApiError.forbidden("Немає доступу до чужого запису"));
        }
      }

      if (medicalRecord.patient_id !== parseInt(patientId)) {
        return next(
          ApiError.badRequest("Цей запис не належить вказаному пацієнту")
        );
      }

      return res.json(medicalRecord.Prescriptions);
    } catch (e) {
      console.error("getPrescriptionsByRecordAndPatient error:", e);
      return next(ApiError.internal("Не вдалося отримати рецепти"));
    }
  }
  async getRecordsByPatient(req, res, next) {
    try {
      const { patientId } = req.params;

      // 🔐 Якщо користувач — пацієнт, перевіряємо доступ
      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({
          where: { user_id: req.user.id },
        });

        if (!patient || patient.id !== parseInt(patientId)) {
          return next(ApiError.forbidden("Немає доступу до чужих записів"));
        }
      }

      const records = await MedicalRecord.findAll({
        where: { patient_id: patientId },
        include: [Prescription],
      });

      return res.json(records);
    } catch (e) {
      console.error("getRecordsByPatient error:", e);
      return next(ApiError.internal("Не вдалося отримати діагнози пацієнта"));
    }
  }
}

module.exports = new MedicalRecordController();
