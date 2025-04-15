const { Appointment } = require('../models/models');
const ApiError = require('../error/ApiError');

class AppointmentController {
    async getAll(req, res, next) {
        try {
            const items = await Appointment.findAll();
            return res.json(items);
        } catch (e) {
            console.error('getAll error:', e);
            return next(ApiError.internal('Не вдалося отримати список прийомів'));
        }
    }

    async getById(req, res, next) {
        try {
            const item = await Appointment.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Прийом не знайдено'));
            return res.json(item);
        } catch (e) {
            console.error('getById error:', e);
            return next(ApiError.internal('Помилка отримання прийому'));
        }
    }

    async create(req, res, next) {
        try {
            const created = await Appointment.create(req.body);
            return res.json(created);
        } catch (e) {
            console.error('create error:', e);
            return next(ApiError.badRequest('Не вдалося створити прийом'));
        }
    }

    async update(req, res, next) {
        try {
            const item = await Appointment.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Прийом не знайдено'));
            await item.update(req.body);
            return res.json(item);
        } catch (e) {
            console.error('update error:', e);
            return next(ApiError.internal('Помилка оновлення прийому'));
        }
    }

    async delete(req, res, next) {
        try {
            const item = await Appointment.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Прийом не знайдено'));
            await item.destroy();
            return res.json({ message: 'Прийом видалено' });
        } catch (e) {
            console.error('delete error:', e);
            return next(ApiError.internal('Помилка видалення прийому'));
        }
    }
}

module.exports = new AppointmentController();