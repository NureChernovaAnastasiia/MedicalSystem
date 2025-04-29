const { MedicalServiceInfo } = require("../models/models");
const ApiError = require("../error/ApiError");

class MedicalServiceInfoController {
  async create(req, res, next) {
    try {
      const { name, price, description, preparation, indications, duration_minutes } = req.body;

      if (!name || !price) {
        return next(ApiError.badRequest("Назва і ціна обов'язкові"));
      }

      const info = await MedicalServiceInfo.create({
        name, price, description, preparation, indications, duration_minutes
      });
      return res.json(info);
    } catch (e) {
      console.error("❌ create MedicalServiceInfo error:", e);
      return next(ApiError.internal("Не вдалося створити послугу"));
    }
  }

  async getAll(req, res, next) {
    try {
      const infos = await MedicalServiceInfo.findAll();
      return res.json(infos);
    } catch (e) {
      console.error("❌ getAll MedicalServiceInfo error:", e);
      return next(ApiError.internal("Не вдалося отримати послуги"));
    }
  }
}

module.exports = new MedicalServiceInfoController();
