const { MedicalServiceInfo, HospitalMedicalService } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class MedicalServiceInfoController {
  // 🔓 Get all services (optional filtering by name and is_ready)
  async getAll(req, res, next) {
    try {
      const { name, is_ready } = req.query;
      const whereClause = {};

      if (name) {
        whereClause.name = { [Op.iLike]: `%${name}%` };
      }

      if (typeof is_ready !== 'undefined') {
        whereClause.is_ready = is_ready === 'true';
      }

      const services = await MedicalServiceInfo.findAll({ where: whereClause });
      return res.json(services);
    } catch (e) {
      console.error('getAll error:', e);
      return next(ApiError.internal('Не вдалося отримати перелік медичних послуг'));
    }
  }

  // 🔓 Get one service by ID
  async getById(req, res, next) {
    try {
      const item = await MedicalServiceInfo.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound('Медичну послугу не знайдено'));
      return res.json(item);
    } catch (e) {
      console.error('getById error:', e);
      return next(ApiError.internal('Помилка отримання медичної послуги'));
    }
  }

  // 🔓 Get services available in a hospital
  async getByHospital(req, res, next) {
    try {
      const { hospitalId } = req.params;

      const services = await HospitalMedicalService.findAll({
        where: { hospital_id: hospitalId },
        include: [
          {
            model: MedicalServiceInfo,
            as: 'MedicalServiceInfo' // ✅ Виправлено
          }
        ],
      });

      const result = services.map(s => s.MedicalServiceInfo).filter(Boolean);
      return res.json(result);
    } catch (e) {
      console.error('getByHospital error:', e);
      return next(ApiError.internal('Не вдалося отримати послуги для лікарні'));
    }
  }

  // 🔐 Create (Admin only)
  async create(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Доступ заборонено'));
      }

      const created = await MedicalServiceInfo.create(req.body);
      return res.status(201).json(created);
    } catch (e) {
      console.error('create error:', e);
      return next(ApiError.badRequest('Не вдалося створити медичну послугу'));
    }
  }

  // 🔐 Update (Admin only)
  async update(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Доступ заборонено'));
      }

      const item = await MedicalServiceInfo.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound('Медичну послугу не знайдено'));

      await item.update(req.body);
      return res.json(item);
    } catch (e) {
      console.error('update error:', e);
      return next(ApiError.internal('Не вдалося оновити медичну послугу'));
    }
  }

  // 🔐 Delete (Admin only)
  async delete(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Доступ заборонено'));
      }

      const item = await MedicalServiceInfo.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound('Медичну послугу не знайдено'));

      await item.destroy();
      return res.json({ message: 'Медичну послугу видалено' });
    } catch (e) {
      console.error('delete error:', e);
      return next(ApiError.internal('Не вдалося видалити медичну послугу'));
    }
  }
}

module.exports = new MedicalServiceInfoController();
