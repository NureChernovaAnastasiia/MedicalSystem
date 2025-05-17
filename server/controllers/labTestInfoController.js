const { LabTestInfo, HospitalLabService } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class LabTestInfoController {
  // 🔓 Get all lab tests (optionally filter by name and is_ready)
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

      const tests = await LabTestInfo.findAll({ where: whereClause });
      return res.json(tests);
    } catch (e) {
      console.error('getAll error:', e);
      return next(ApiError.internal('Failed to fetch lab tests'));
    }
  }

  // 🔓 Get single lab test by ID
  async getById(req, res, next) {
    try {
      const test = await LabTestInfo.findByPk(req.params.id);
      if (!test) return next(ApiError.notFound('Lab test not found'));
      return res.json(test);
    } catch (e) {
      console.error('getById error:', e);
      return next(ApiError.internal('Error fetching lab test'));
    }
  }

  // 🔓 Get all lab tests available in a specific hospital
  async getByHospital(req, res, next) {
    try {
      const { hospitalId } = req.params;

      const services = await HospitalLabService.findAll({
        where: { hospital_id: hospitalId },
        include: [LabTestInfo],
      });

      const result = services.map(s => s.LabTestInfo);
      return res.json(result);
    } catch (e) {
      console.error('getByHospital error:', e);
      return next(ApiError.internal('Failed to fetch lab tests for hospital'));
    }
  }

  // 🔐 Create lab test (Admin only)
  async create(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Access denied'));
      }

      const created = await LabTestInfo.create(req.body);
      return res.status(201).json(created);
    } catch (e) {
      console.error('create error:', e);
      return next(ApiError.badRequest('Failed to create lab test'));
    }
  }

  // 🔐 Update lab test (Admin only)
  async update(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Access denied'));
      }

      const test = await LabTestInfo.findByPk(req.params.id);
      if (!test) return next(ApiError.notFound('Lab test not found'));

      await test.update(req.body);
      return res.json(test);
    } catch (e) {
      console.error('update error:', e);
      return next(ApiError.internal('Failed to update lab test'));
    }
  }

  // 🔐 Delete lab test (Admin only)
  async delete(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Access denied'));
      }

      const test = await LabTestInfo.findByPk(req.params.id);
      if (!test) return next(ApiError.notFound('Lab test not found'));

      await test.destroy();
      return res.json({ message: 'Lab test deleted' });
    } catch (e) {
      console.error('delete error:', e);
      return next(ApiError.internal('Failed to delete lab test'));
    }
  }
}

module.exports = new LabTestInfoController();