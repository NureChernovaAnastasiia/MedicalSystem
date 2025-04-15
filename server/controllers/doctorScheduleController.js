const { DoctorSchedule } = require('../models/models');
const ApiError = require('../error/ApiError');

class DoctorScheduleController {
    async getAll(req, res, next) {
        try {
            const items = await DoctorSchedule.findAll();
            return res.json(items);
        } catch (e) {
            console.error('getAll error:', e);
            return next(ApiError.internal('Не вдалося отримати список розкладів лікарів'));
        }
    }

    async getById(req, res, next) {
        try {
            const item = await DoctorSchedule.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Розклад не знайдено'));
            return res.json(item);
        } catch (e) {
            console.error('getById error:', e);
            return next(ApiError.internal('Помилка отримання розкладу'));
        }
    }

    async create(req, res, next) {
        try {
            const created = await DoctorSchedule.create(req.body);
            return res.json(created);
        } catch (e) {
            console.error('create error:', e);
            return next(ApiError.badRequest('Не вдалося створити розклад'));
        }
    }

    async update(req, res, next) {
        try {
            const item = await DoctorSchedule.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Розклад не знайдено'));
            await item.update(req.body);
            return res.json(item);
        } catch (e) {
            console.error('update error:', e);
            return next(ApiError.internal('Помилка оновлення розкладу'));
        }
    }

    async delete(req, res, next) {
        try {
            const item = await DoctorSchedule.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Розклад не знайдено'));
            await item.destroy();
            return res.json({ message: 'Розклад видалено' });
        } catch (e) {
            console.error('delete error:', e);
            return next(ApiError.internal('Помилка видалення розкладу'));
        }
    }
}

module.exports = new DoctorScheduleController();