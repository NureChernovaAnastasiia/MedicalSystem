const { LabTestInfo, HospitalLabService } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class LabTestInfoController {
  // 🔓 Отримати всі тести
  async getAll(req, res, next) {
    try {
      const { name } = req.query;
      const whereClause = {};

      if (name) {
        whereClause.name = { [Op.iLike]: `%${name}%` };
      }

      const tests = await LabTestInfo.findAll({ where: whereClause });
      return res.json(tests);
    } catch (e) {
      console.error('getAll error:', e);
      return next(ApiError.internal('Не вдалося отримати список тестів'));
    }
  }

  // 🔓 Отримати тест по ID
  async getById(req, res, next) {
    try {
      const test = await LabTestInfo.findByPk(req.params.id);
      if (!test) return next(ApiError.notFound('Тест не знайдено'));
      return res.json(test);
    } catch (e) {
      console.error('getById error:', e);
      return next(ApiError.internal('Помилка отримання тесту'));
    }
  }

  // 🔓 Отримати всі тести доступні в лікарні
  async getByHospital(req, res, next) {
    try {
      const { hospitalId } = req.params;

      const services = await HospitalLabService.findAll({
        where: { hospital_id: hospitalId },
        include: [LabTestInfo],
      });

      const tests = services.map(s => s.LabTestInfo);
      return res.json(tests);
    } catch (e) {
      console.error('getByHospital error:', e);
      return next(ApiError.internal('Не вдалося отримати тести для лікарні'));
    }
  }

  // 🔐 Створити (Admin only)
  async create(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Доступ заборонено'));
      }

      const created = await LabTestInfo.create(req.body);
      return res.json(created);
    } catch (e) {
      console.error('create error:', e);
      return next(ApiError.badRequest('Не вдалося створити тест'));
    }
  }

  // 🔐 Оновити (Admin only)
  async update(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Доступ заборонено'));
      }

      const test = await LabTestInfo.findByPk(req.params.id);
      if (!test) return next(ApiError.notFound('Тест не знайдено'));

      await test.update(req.body);
      return res.json(test);
    } catch (e) {
      console.error('update error:', e);
      return next(ApiError.internal('Помилка оновлення тесту'));
    }
  }

  // 🔐 Видалити (Admin only)
  async delete(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Доступ заборонено'));
      }

      const test = await LabTestInfo.findByPk(req.params.id);
      if (!test) return next(ApiError.notFound('Тест не знайдено'));

      await test.destroy();
      return res.json({ message: 'Тест видалено' });
    } catch (e) {
      console.error('delete error:', e);
      return next(ApiError.internal('Помилка видалення тесту'));
    }
  }
}

module.exports = new LabTestInfoController();
