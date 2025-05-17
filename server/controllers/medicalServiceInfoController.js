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
      return next(ApiError.internal('Failed to fetch medical services'));
    }
  }

  // 🔓 Get one service by ID
  async getById(req, res, next) {
    try {
      const item = await MedicalServiceInfo.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound('Medical service not found'));
      return res.json(item);
    } catch (e) {
      console.error('getById error:', e);
      return next(ApiError.internal('Error fetching medical service'));
    }
  }

  // 🔓 Get services available in a hospital
  async getByHospital(req, res, next) {
    try {
      const { hospitalId } = req.params;

      const services = await HospitalMedicalService.findAll({
        where: { hospital_id: hospitalId },
        include: [MedicalServiceInfo],
      });

      const result = services.map(s => s.MedicalServiceInfo);
      return res.json(result);
    } catch (e) {
      console.error('getByHospital error:', e);
      return next(ApiError.internal('Failed to get services for hospital'));
    }
  }

  // 🔐 Create (Admin only)
  async create(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Access denied'));
      }

      const created = await MedicalServiceInfo.create(req.body);
      return res.status(201).json(created);
    } catch (e) {
      console.error('create error:', e);
      return next(ApiError.badRequest('Failed to create medical service'));
    }
  }

  // 🔐 Update (Admin only)
  async update(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Access denied'));
      }

      const item = await MedicalServiceInfo.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound('Medical service not found'));

      await item.update(req.body);
      return res.json(item);
    } catch (e) {
      console.error('update error:', e);
      return next(ApiError.internal('Failed to update medical service'));
    }
  }

  // 🔐 Delete (Admin only)
  async delete(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Access denied'));
      }

      const item = await MedicalServiceInfo.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound('Medical service not found'));

      await item.destroy();
      return res.json({ message: 'Medical service deleted' });
    } catch (e) {
      console.error('delete error:', e);
      return next(ApiError.internal('Failed to delete medical service'));
    }
  }
}

module.exports = new MedicalServiceInfoController();