const { MedicalServiceSchedule } = require("../models/models");
const ApiError = require("../error/ApiError");

class MedicalServiceScheduleController {
  async create(req, res, next) {
    try {
      const { hospital_medical_service_id, appointment_date, start_time, end_time } = req.body;

      if (!hospital_medical_service_id || !appointment_date || !start_time || !end_time) {
        return next(ApiError.badRequest("Всі поля обов'язкові"));
      }

      const schedule = await MedicalServiceSchedule.create({
        hospital_medical_service_id, appointment_date, start_time, end_time
      });
      return res.json(schedule);
    } catch (e) {
      console.error("❌ create MedicalServiceSchedule error:", e);
      return next(ApiError.internal("Не вдалося створити розклад послуги"));
    }
  }

  async getByHospitalService(req, res, next) {
    try {
      const { hospital_medical_service_id } = req.params;

      const schedules = await MedicalServiceSchedule.findAll({
        where: { hospital_medical_service_id }
      });

      return res.json(schedules);
    } catch (e) {
      console.error("❌ getByHospitalService MedicalServiceSchedule error:", e);
      return next(ApiError.internal("Помилка отримання розкладу"));
    }
  }
}

module.exports = new MedicalServiceScheduleController();
