const { HospitalMedicalService } = require("../models/models");
const ApiError = require("../error/ApiError");

class HospitalMedicalServiceController {
  async assign(req, res, next) {
    try {
      const { hospital_id, medical_service_info_id, doctor_id } = req.body;

      if (!hospital_id || !medical_service_info_id || !doctor_id) {
        return next(ApiError.badRequest("Всі поля обов'язкові"));
      }

      const record = await HospitalMedicalService.create({ hospital_id, medical_service_info_id, doctor_id });
      return res.json(record);
    } catch (e) {
      console.error("❌ assign error:", e);
      return next(ApiError.internal("Не вдалося призначити послугу до лікарні"));
    }
  }

  async getAll(req, res, next) {
    try {
      const services = await HospitalMedicalService.findAll();
      return res.json(services);
    } catch (e) {
      console.error("❌ getAll error:", e);
      return next(ApiError.internal("Не вдалося отримати список послуг лікарні"));
    }
  }
}

module.exports = new HospitalMedicalServiceController();
