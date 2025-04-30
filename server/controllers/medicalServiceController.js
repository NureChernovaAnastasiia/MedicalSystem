const { MedicalService } = require("../models/models");
const ApiError = require("../error/ApiError");

class MedicalServiceController {
  async book(req, res, next) {
    try {
      const { patient_id, doctor_id, medical_service_schedule_id } = req.body;

      if (!patient_id || !doctor_id || !medical_service_schedule_id) {
        return next(ApiError.badRequest("Всі поля обов'язкові"));
      }

      const booking = await MedicalService.create({
        patient_id, doctor_id, medical_service_schedule_id
      });
      return res.json(booking);
    } catch (e) {
      console.error("❌ book MedicalService error:", e);
      return next(ApiError.internal("Не вдалося створити запис на послугу"));
    }
  }

  async getAll(req, res, next) {
    try {
      const bookings = await MedicalService.findAll();
      return res.json(bookings);
    } catch (e) {
      console.error("❌ getAll MedicalService error:", e);
      return next(ApiError.internal("Не вдалося отримати записи послуг"));
    }
  }
}

module.exports = new MedicalServiceController();
