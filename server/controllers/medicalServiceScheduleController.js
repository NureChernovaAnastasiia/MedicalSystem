const { MedicalServiceSchedule } = require("../models/models");
const ApiError = require("../error/ApiError");

class MedicalServiceScheduleController {
  async create(req, res, next) {
    try {
      const { hospital_medical_service_id, appointment_date, start_time, end_time } = req.body;
      const schedule = await MedicalServiceSchedule.create({
        hospital_medical_service_id, appointment_date, start_time, end_time
      });
      res.json(schedule);
    } catch (e) {
      next(ApiError.internal("Не вдалося створити розклад послуги"));
    }
  }

  async getByHospitalService(req, res, next) {
    try {
      const { hospital_medical_service_id } = req.params;
      const schedules = await MedicalServiceSchedule.findAll({ where: { hospital_medical_service_id } });
      res.json(schedules);
    } catch (e) {
      next(ApiError.internal("Помилка отримання розкладу"));
    }
  }
}

module.exports = new MedicalServiceScheduleController();