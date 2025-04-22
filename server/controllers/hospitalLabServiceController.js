const { HospitalLabService, LabTestInfo, Hospital, Doctor } = require('../models/models');
const ApiError = require('../error/ApiError');

class HospitalLabServiceController {
  // Всі послуги (можуть бачити всі)
  async getAll(req, res, next) {
    try {
      const items = await HospitalLabService.findAll({
        include: [LabTestInfo, Hospital, Doctor],
      });

      return res.json(items);
    } catch (e) {
      console.error('getAll error:', e);
      return next(ApiError.internal('Не вдалося отримати список лабораторних послуг'));
    }
  }

  // Послуги для конкретної лікарні
  async getByHospital(req, res, next) {
    try {
      const { hospitalId } = req.params;

      const items = await HospitalLabService.findAll({
        where: { hospital_id: hospitalId },
        include: [LabTestInfo, Doctor],
      });

      return res.json(items);
    } catch (e) {
      console.error('getByHospital error:', e);
      return next(ApiError.internal('Не вдалося отримати послуги лікарні'));
    }
  }

  // Отримати одну
  async getById(req, res, next) {
    try {
      const item = await HospitalLabService.findByPk(req.params.id, {
        include: [LabTestInfo, Doctor, Hospital],
      });

      if (!item) return next(ApiError.notFound('Послугу не знайдено'));

      return res.json(item);
    } catch (e) {
      console.error('getById error:', e);
      return next(ApiError.internal('Помилка отримання послуги'));
    }
  }

  // Створити (Admin, Doctor)
  async create(req, res, next) {
    try {
      if (!['Admin', 'Doctor'].includes(req.user.role)) {
        return next(ApiError.forbidden('Немає доступу'));
      }

      const created = await HospitalLabService.create(req.body);
      return res.json(created);
    } catch (e) {
      console.error('create error:', e);
      return next(ApiError.badRequest('Не вдалося створити послугу'));
    }
  }

  // Оновити (Admin, Doctor)
  async update(req, res, next) {
    try {
      if (!['Admin', 'Doctor'].includes(req.user.role)) {
        return next(ApiError.forbidden('Немає доступу'));
      }

      const item = await HospitalLabService.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound('Послугу не знайдено'));

      await item.update(req.body);
      return res.json(item);
    } catch (e) {
      console.error('update error:', e);
      return next(ApiError.internal('Помилка оновлення послуги'));
    }
  }

  // Видалити (Admin, Doctor)
  async delete(req, res, next) {
    try {
      if (!['Admin', 'Doctor'].includes(req.user.role)) {
        return next(ApiError.forbidden('Немає доступу'));
      }

      const item = await HospitalLabService.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound('Послугу не знайдено'));

      await item.destroy();
      return res.json({ message: 'Послугу видалено' });
    } catch (e) {
      console.error('delete error:', e);
      return next(ApiError.internal('Помилка видалення послуги'));
    }
  }
}

module.exports = new HospitalLabServiceController();
