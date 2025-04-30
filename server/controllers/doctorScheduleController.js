const { DoctorSchedule, Doctor } = require('../models/models');
const ApiError = require('../error/ApiError');

class DoctorScheduleController {
  // Усі розклади лікарів (лише Admin)
  async getAll(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Доступ заборонено'));
      }

      const schedules = await DoctorSchedule.findAll({ include: Doctor });
      return res.json(schedules);
    } catch (e) {
      console.error('getAll error:', e);
      return next(ApiError.internal('Не вдалося отримати список розкладів'));
    }
  }

  // Розклад за лікарнею
  async getByHospital(req, res, next) {
    try {
      const { hospitalId } = req.params;
      const schedules = await DoctorSchedule.findAll({
        include: {
          model: Doctor,
          where: { hospital_id: hospitalId },
        },
      });
      return res.json(schedules);
    } catch (e) {
      console.error('getByHospital error:', e);
      return next(ApiError.internal('Не вдалося отримати розклади лікарні'));
    }
  }

  // Розклад одного лікаря
  async getByDoctor(req, res, next) {
    try {
      const { doctorId } = req.params;

      // Лікар може бачити тільки свій розклад
      if (req.user.role === 'Doctor') {
        const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
        if (!doctor || doctor.id !== parseInt(doctorId)) {
          return next(ApiError.forbidden('Немає доступу до чужого розкладу'));
        }
      }

      const schedules = await DoctorSchedule.findAll({
        where: { doctor_id: doctorId },
      });

      return res.json(schedules);
    } catch (e) {
      console.error('getByDoctor error:', e);
      return next(ApiError.internal('Не вдалося отримати розклад лікаря'));
    }
  }

  // Створення розкладу (тільки Admin)
  async create(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Тільки адміністратор може створювати розклад'));
      }

      const created = await DoctorSchedule.create(req.body);
      return res.json(created);
    } catch (e) {
      console.error('create error:', e);
      return next(ApiError.badRequest('Не вдалося створити розклад'));
    }
  }

  // Оновлення розкладу (тільки Admin)
  async update(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Тільки адміністратор може оновлювати розклад'));
      }

      const item = await DoctorSchedule.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound('Розклад не знайдено'));
      await item.update(req.body);
      return res.json(item);
    } catch (e) {
      console.error('update error:', e);
      return next(ApiError.internal('Помилка оновлення розкладу'));
    }
  }

  // Видалення розкладу (тільки Admin)
  async delete(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Тільки адміністратор може видаляти розклад'));
      }

      const item = await DoctorSchedule.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound('Розклад не знайдено'));
      await item.destroy();
      return res.json({ message: 'Розклад видалено' });
    } catch (e) {
      console.error('delete error:', e);
      return next(ApiError.internal('Помилка видалення розкладу'));
    }
  }
  
  // Розклад лікаря по конкретному дню (доступний всім)
async getByDoctorAndDate(req, res, next) {
  try {
    const { doctorId, date } = req.params;

    if (!doctorId || !date) {
      return next(ApiError.badRequest("Потрібні doctorId і date"));
    }

    const schedules = await DoctorSchedule.findAll({
      where: {
        doctor_id: doctorId,
        appointment_date: date,
      },
    });

    return res.json(schedules);
  } catch (e) {
    console.error("getByDoctorAndDate error:", e);
    return next(ApiError.internal("Не вдалося отримати розклад на вказану дату"));
  }
}

}

module.exports = new DoctorScheduleController();
