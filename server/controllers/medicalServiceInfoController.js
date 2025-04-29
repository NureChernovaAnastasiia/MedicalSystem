const { MedicalServiceInfo } = require("../models/models");
const ApiError = require("../error/ApiError");

class MedicalServiceInfoController {
  async create(req, res, next) {
    try {
      const { name, price, description, preparation, indications, duration_minutes } = req.body;
      const info = await MedicalServiceInfo.create({
        name, price, description, preparation, indications, duration_minutes
      });
      res.json(info);
    } catch (e) {
      console.error("create MedicalServiceInfo:", e);
      next(ApiError.internal("Не вдалося створити послугу"));
    }
  }

  async getAll(req, res, next) {
    try {
      const infos = await MedicalServiceInfo.findAll();
      res.json(infos);
    } catch (e) {
      next(ApiError.internal("Не вдалося отримати послуги"));
    }
  }
}

module.exports = new MedicalServiceInfoController();