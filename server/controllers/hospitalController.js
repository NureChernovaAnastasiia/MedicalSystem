const { Hospital } = require('../models/models');
const ApiError = require('../error/ApiError');

class HospitalController {
    async getAll(req, res, next) {
        try {
            const items = await Hospital.findAll();
            return res.json(items);
        } catch (e) {
            console.error('getAll error:', e);
            return next(ApiError.internal('Не вдалося отримати список лікарень'));
        }
    }

    async getById(req, res, next) {
        try {
            const item = await Hospital.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Лікарню не знайдено'));
            return res.json(item);
        } catch (e) {
            console.error('getById error:', e);
            return next(ApiError.internal('Помилка отримання лікарні'));
        }
    }

    async create(req, res, next) {
        try {
            const created = await Hospital.create(req.body);
            return res.json(created);
        } catch (e) {
            console.error('create error:', e);
            return next(ApiError.badRequest('Не вдалося створити лікарню'));
        }
    }

    async update(req, res, next) {
        try {
            const item = await Hospital.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Лікарню не знайдено'));
            await item.update(req.body);
            return res.json(item);
        } catch (e) {
            console.error('update error:', e);
            return next(ApiError.internal('Помилка оновлення лікарні'));
        }
    }

    async delete(req, res, next) {
        try {
            const item = await Hospital.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Лікарню не знайдено'));
            await item.destroy();
            return res.json({ message: 'Лікарню видалено' });
        } catch (e) {
            console.error('delete error:', e);
            return next(ApiError.internal('Помилка видалення лікарні'));
        }
    }
}

module.exports = new HospitalController();