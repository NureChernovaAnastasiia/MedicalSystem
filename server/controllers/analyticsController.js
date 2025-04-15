const { Analytics } = require('../models/models');
const ApiError = require('../error/ApiError');

class AnalyticsController {
    async getAll(req, res, next) {
        try {
            const items = await Analytics.findAll();
            return res.json(items);
        } catch (e) {
            console.error('getAll error:', e);
            return next(ApiError.internal('Не вдалося отримати аналітику'));
        }
    }

    async getById(req, res, next) {
        try {
            const item = await Analytics.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Аналітику не знайдено'));
            return res.json(item);
        } catch (e) {
            console.error('getById error:', e);
            return next(ApiError.internal('Помилка отримання аналітики'));
        }
    }

    async create(req, res, next) {
        try {
            const created = await Analytics.create(req.body);
            return res.json(created);
        } catch (e) {
            console.error('create error:', e);
            return next(ApiError.badRequest('Не вдалося створити аналітику'));
        }
    }

    async update(req, res, next) {
        try {
            const item = await Analytics.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Аналітику не знайдено'));
            await item.update(req.body);
            return res.json(item);
        } catch (e) {
            console.error('update error:', e);
            return next(ApiError.internal('Помилка оновлення аналітики'));
        }
    }

    async delete(req, res, next) {
        try {
            const item = await Analytics.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Аналітику не знайдено'));
            await item.destroy();
            return res.json({ message: 'Аналітику видалено' });
        } catch (e) {
            console.error('delete error:', e);
            return next(ApiError.internal('Помилка видалення аналітики'));
        }
    }
}

module.exports = new AnalyticsController();
