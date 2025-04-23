const { LabTestSchedule, HospitalLabService, Hospital, LabTestInfo, Doctor } = require('../models/models');
const ApiError = require('../error/ApiError');

class LabTestScheduleController {
  // 🔍 Перегляд усіх розкладів (усі авторизовані)
  async getAll(req, res, next) {
    try {
      const schedules = await LabTestSchedule.findAll({
        include: {
          model: HospitalLabService,
          include: [Hospital, LabTestInfo, Doctor],
        },
      });

      const formatted = schedules.map(schedule => {
        const service = schedule.HospitalLabService;
        const hospital = service?.Hospital;
        const isPrivate = hospital?.type === 'Приватна';

        return {
          id: schedule.id,
          date: schedule.appointment_date,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          is_booked: schedule.is_booked,
          hospital: hospital?.name,
          test_name: service?.LabTestInfo?.name,
          doctor: `${service?.Doctor?.first_name || ''} ${service?.Doctor?.last_name || ''}`,
          ...(isPrivate && { test_price: service?.LabTestInfo?.price }),
        };
      });

      return res.json(formatted);
    } catch (e) {
      console.error('getAll error:', e);
      return next(ApiError.internal('Не вдалося отримати список розкладів аналізів'));
    }
  }

  // 🔍 Один розклад
  async getById(req, res, next) {
    try {
      const item = await LabTestSchedule.findByPk(req.params.id, {
        include: {
          model: HospitalLabService,
          include: [Hospital, LabTestInfo, Doctor],
        },
      });

      if (!item) return next(ApiError.notFound('Розклад аналізу не знайдено'));

      const service = item.HospitalLabService;
      const isPrivate = service?.Hospital?.type === 'Приватна';

      return res.json({
        id: item.id,
        date: item.appointment_date,
        start_time: item.start_time,
        end_time: item.end_time,
        is_booked: item.is_booked,
        hospital: service?.Hospital?.name,
        test_name: service?.LabTestInfo?.name,
        doctor: `${service?.Doctor?.first_name || ''} ${service?.Doctor?.last_name || ''}`,
        ...(isPrivate && { test_price: service?.LabTestInfo?.price }),
      });
    } catch (e) {
      console.error('getById error:', e);
      return next(ApiError.internal('Помилка отримання розкладу аналізу'));
    }
  }

  // ➕ Створення (Admin або Doctor)
  async create(req, res, next) {
    try {
      if (!['Admin', 'Doctor'].includes(req.user.role)) {
        return next(ApiError.forbidden('Недостатньо прав для створення розкладу'));
      }

      const created = await LabTestSchedule.create(req.body);
      return res.status(201).json(created);
    } catch (e) {
      console.error('create error:', e);
      return next(ApiError.badRequest('Не вдалося створити розклад аналізу'));
    }
  }

  // ✏️ Оновлення (Admin або Doctor)
  async update(req, res, next) {
    try {
      if (!['Admin', 'Doctor'].includes(req.user.role)) {
        return next(ApiError.forbidden('Недостатньо прав для оновлення'));
      }

      const item = await LabTestSchedule.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound('Розклад аналізу не знайдено'));

      await item.update(req.body);
      return res.json(item);
    } catch (e) {
      console.error('update error:', e);
      return next(ApiError.internal('Помилка оновлення розкладу аналізу'));
    }
  }

  // 🗑 Видалення (Admin або Doctor)
  async delete(req, res, next) {
    try {
      if (!['Admin', 'Doctor'].includes(req.user.role)) {
        return next(ApiError.forbidden('Недостатньо прав для видалення'));
      }

      const item = await LabTestSchedule.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound('Розклад аналізу не знайдено'));

      await item.destroy();
      return res.json({ message: 'Розклад аналізу успішно видалено' });
    } catch (e) {
      console.error('delete error:', e);
      return next(ApiError.internal('Помилка видалення розкладу аналізу'));
    }
  }
}

module.exports = new LabTestScheduleController();