const { Prescription, Patient, Doctor, Hospital } = require("../models/models");
const ApiError = require("../error/ApiError");
const generatePrescriptionPdf = require("../utils/prescriptionPdfGenerator");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

class PrescriptionController {
  async getAll(req, res, next) {
    try {
      if (req.user.role !== "Doctor" && req.user.role !== "Admin") {
        return next(
          ApiError.forbidden(
            "Тільки лікар або адміністратор можуть переглядати всі рецепти"
          )
        );
      }
      const items = await Prescription.findAll();
      return res.json(items);
    } catch (e) {
      console.error("getAll error:", e);
      return next(ApiError.internal("Не вдалося отримати список рецептів"));
    }
  }

  async getById(req, res, next) {
    try {
      const item = await Prescription.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Рецепт не знайдено"));

      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({
          where: { user_id: req.user.id },
        });
        if (!patient || patient.id !== item.patient_id) {
          return next(ApiError.forbidden("Немає доступу до чужого рецепту"));
        }
      }

      return res.json(item);
    } catch (e) {
      console.error("getById error:", e);
      return next(ApiError.internal("Помилка отримання рецепту"));
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
          return next(ApiError.forbidden("Немає доступу до чужих рецептів"));
        }
      }

      const items = await Prescription.findAll({
        where: { patient_id: patientId },
      });
      return res.json(items);
    } catch (e) {
      console.error("getByPatient error:", e);
      return next(ApiError.internal("Не вдалося отримати рецепти пацієнта"));
    }
  }

  async create(req, res, next) {
    try {
      if (req.user.role !== "Doctor" && req.user.role !== "Admin") {
        return next(
          ApiError.forbidden(
            "Тільки лікар або адміністратор можуть створювати рецепт"
          )
        );
      }
      const created = await Prescription.create(req.body);
      return res.json(created);
    } catch (e) {
      console.error("create error:", e);
      return next(ApiError.badRequest("Не вдалося створити рецепт"));
    }
  }

  async update(req, res, next) {
    try {
      if (req.user.role !== "Doctor" && req.user.role !== "Admin") {
        return next(
          ApiError.forbidden(
            "Тільки лікар або адміністратор можуть оновлювати рецепт"
          )
        );
      }
      const item = await Prescription.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Рецепт не знайдено"));
      await item.update(req.body);
      return res.json(item);
    } catch (e) {
      console.error("update error:", e);
      return next(ApiError.internal("Помилка оновлення рецепту"));
    }
  }

  async delete(req, res, next) {
    try {
      if (req.user.role !== "Doctor" && req.user.role !== "Admin") {
        return next(
          ApiError.forbidden(
            "Тільки лікар або адміністратор можуть видаляти рецепт"
          )
        );
      }
      const item = await Prescription.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Рецепт не знайдено"));
      await item.destroy();
      return res.json({ message: "Рецепт видалено" });
    } catch (e) {
      console.error("delete error:", e);
      return next(ApiError.internal("Помилка видалення рецепту"));
    }
  }
  async getByPatientAndId(req, res, next) {
    try {
      const { patientId, id } = req.params;

      const prescription = await Prescription.findByPk(id);
      if (!prescription) return next(ApiError.notFound("Рецепт не знайдено"));

      // Перевірка чи рецепт належить пацієнту
      if (prescription.patient_id !== parseInt(patientId)) {
        return next(ApiError.forbidden("Рецепт не належить цьому пацієнту"));
      }

      // Пацієнт може бачити лише свої рецепти
      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({
          where: { user_id: req.user.id },
        });
        if (!patient || patient.id !== parseInt(patientId)) {
          return next(ApiError.forbidden("Немає доступу до чужого рецепту"));
        }
      }

      // Doctor і Admin — мають доступ
      if (["Doctor", "Admin", "Patient"].includes(req.user.role)) {
        return res.json(prescription);
      }

      return next(ApiError.forbidden("Недостатньо прав для перегляду рецепту"));
    } catch (e) {
      console.error("getByPatientAndId error:", e);
      return next(ApiError.internal("Не вдалося отримати рецепт"));
    }
  }
  async downloadPdf(req, res, next) {
    try {
      const { id } = req.params;
      const prescription = await Prescription.findByPk(id, {
        include: [
          { model: Patient },
          { model: Doctor, include: ["Hospital"] },
        ],
      });
  
      if (!prescription) return next(ApiError.notFound("Рецепт не знайдено"));
  
      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({ where: { user_id: req.user.id } });
        if (!patient || patient.id !== prescription.patient_id) {
          return next(ApiError.forbidden("Немає доступу до рецепту"));
        }
      }
  
      await generatePrescriptionPdf(prescription, res);
    } catch (e) {
      console.error("downloadPdf error:", e);
      return next(ApiError.internal("Не вдалося згенерувати PDF рецепт"));
    }
  }
}

module.exports = new PrescriptionController();
