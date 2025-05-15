const { HospitalMedicalService, Hospital, MedicalServiceInfo, Doctor } = require('../models/models');
const ApiError = require('../error/ApiError');

class HospitalMedicalServiceController {
  // 🔍 Отримати всі записи зв'язків лікарень і послуг
  async getAll(req, res, next) {
    try {
      const items = await HospitalMedicalService.findAll({
        include: [Hospital, MedicalServiceInfo, Doctor],
      });
      return res.json(items);
    } catch (e) {
      console.error('getAll error:', e);
      return next(ApiError.internal('Не вдалося отримати список призначених послуг'));
    }
  }

  // 🔍 Отримати всі послуги для конкретної лікарні
  async getByHospital(req, res, next) {
    try {
      const { hospitalId } = req.params;
      const items = await HospitalMedicalService.findAll({
        where: { hospital_id: hospitalId },
        include: [MedicalServiceInfo, Doctor],
      });
      return res.json(items);
    } catch (e) {
      console.error('getByHospital error:', e);
      return next(ApiError.internal('Не вдалося отримати послуги для лікарні'));
    }
  }

  // 🔍 Отримати всі послуги для лікаря
  async getByDoctor(req, res, next) {
    try {
      const { doctorId } = req.params;
      const items = await HospitalMedicalService.findAll({
        where: { doctor_id: doctorId },
        include: [Hospital, MedicalServiceInfo],
      });
      return res.json(items);
    } catch (e) {
      console.error('getByDoctor error:', e);
      return next(ApiError.internal('Не вдалося отримати послуги лікаря'));
    }
  }

  // ➕ Створити зв'язок (Admin only)
  async create(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Доступ заборонено'));
      }
      const created = await HospitalMedicalService.create(req.body);
      return res.status(201).json(created);
    } catch (e) {
      console.error('create error:', e);
      return next(ApiError.badRequest('Не вдалося створити запис'));
    }
  }

  // ✏️ Оновити запис (Admin only)
  async update(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Доступ заборонено'));
      }
      const item = await HospitalMedicalService.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound('Запис не знайдено'));

      await item.update(req.body);
      return res.json(item);
    } catch (e) {
      console.error('update error:', e);
      return next(ApiError.internal('Не вдалося оновити запис'));
    }
  }

  // 🗑 Видалити запис (Admin only)
  async delete(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Доступ заборонено'));
      }
      const item = await HospitalMedicalService.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound('Запис не знайдено'));

      await item.destroy();
      return res.json({ message: 'Запис видалено' });
    } catch (e) {
      console.error('delete error:', e);
      return next(ApiError.internal('Не вдалося видалити запис'));
    }
  }
}

module.exports = new HospitalMedicalServiceController();
