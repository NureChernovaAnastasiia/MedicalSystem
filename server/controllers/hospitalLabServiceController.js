const { HospitalLabService } = require('../models/models');
const ApiError = require('../error/ApiError');

class HospitalLabServiceController {
    async getAll(req, res, next) {
        try {
            const items = await HospitalLabService.findAll();
            return res.json(items);
        } catch (e) {
            console.error('getAll error:', e);
            return next(ApiError.internal('Не вдалося отримати список лабораторних послуг'));
        }
    }

    async getById(req, res, next) {
        try {
            const item = await HospitalLabService.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Послугу не знайдено'));
            return res.json(item);
        } catch (e) {
            console.error('getById error:', e);
            return next(ApiError.internal('Помилка отримання послуги'));
        }
    }

    async create(req, res, next) {
        try {
            const created = await HospitalLabService.create(req.body);
            return res.json(created);
        } catch (e) {
            console.error('create error:', e);
            return next(ApiError.badRequest('Не вдалося створити послугу'));
        }
    }

    async update(req, res, next) {
        try {
            const item = await HospitalLabService.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Послугу не знайдено'));
            await item.update(req.body);
            return res.json(item);
        } catch (e) {
            console.error('update error:', e);
            return next(ApiError.internal('Помилка оновлення послуги'));
        }
    }

    async delete(req, res, next) {
        try {
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
