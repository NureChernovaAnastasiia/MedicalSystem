const { MedicalService } = require("../models/models");
const ApiError = require("../error/ApiError");

class MedicalServiceController {
  async book(req, res, next) {
    try {
      const { patient_id, doctor_id, medical_service_schedule_id } = req.body;
      const booking = await MedicalService.create({
        patient_id, doctor_id, medical_service_schedule_id
      });
      res.json(booking);
    } catch (e) {
      next(ApiError.internal("Не вдалося створити запис на послугу"));
    }
  }

  async getAll(req, res) {
    const bookings = await MedicalService.findAll();
    res.json(bookings);
  }
}

module.exports = new MedicalServiceController();