const { HospitalMedicalService } = require("../models/models");
const ApiError = require("../error/ApiError");

class HospitalMedicalServiceController {
  async assign(req, res, next) {
    try {
      const { hospital_id, medical_service_info_id, doctor_id } = req.body;
      const record = await HospitalMedicalService.create({ hospital_id, medical_service_info_id, doctor_id });
      res.json(record);
    } catch (e) {
      next(ApiError.internal("Не вдалося призначити послугу до лікарні"));
    }
  }

  async getAll(req, res) {
    const services = await HospitalMedicalService.findAll();
    res.json(services);
  }
}

module.exports = new HospitalMedicalServiceController();