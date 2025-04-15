const { LabTest } = require('../models/models');
const ApiError = require('../error/ApiError');

class LabTestController {
    async getAll(req, res, next) {
        try {
            const items = await LabTest.findAll();
            return res.json(items);
        } catch (e) {
            console.error('getAll error:', e);
            return next(ApiError.internal('Не вдалося отримати список аналізів'));
        }
    }

    async getById(req, res, next) {
        try {
            const item = await LabTest.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Аналіз не знайдено'));
            return res.json(item);
        } catch (e) {
            console.error('getById error:', e);
            return next(ApiError.internal('Помилка отримання аналізу'));
        }
    }

    async create(req, res, next) {
        try {
            const created = await LabTest.create(req.body);
            return res.json(created);
        } catch (e) {
            console.error('create error:', e);
            return next(ApiError.badRequest('Не вдалося створити аналіз'));
        }
    }

    async update(req, res, next) {
        try {
            const item = await LabTest.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Аналіз не знайдено'));
            await item.update(req.body);
            return res.json(item);
        } catch (e) {
            console.error('update error:', e);
            return next(ApiError.internal('Помилка оновлення аналізу'));
        }
    }

    async delete(req, res, next) {
        try {
            const item = await LabTest.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Аналіз не знайдено'));
            await item.destroy();
            return res.json({ message: 'Аналіз видалено' });
        } catch (e) {
            console.error('delete error:', e);
            return next(ApiError.internal('Помилка видалення аналізу'));
        }
    }
}

module.exports = new LabTestController();