const { Doctor } = require('../models/models');
const ApiError = require('../error/ApiError');

class DoctorController {
    async getAll(req, res, next) {
        try {
            const items = await Doctor.findAll();
            return res.json(items);
        } catch (e) {
            console.error('getAll error:', e);
            return next(ApiError.internal('Не вдалося отримати список лікарів'));
        }
    }

    async getById(req, res, next) {
        try {
            const item = await Doctor.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Лікаря не знайдено'));
            return res.json(item);
        } catch (e) {
            console.error('getById error:', e);
            return next(ApiError.internal('Помилка отримання лікаря'));
        }
    }

    async create(req, res, next) {
        try {
            const created = await Doctor.create(req.body);
            return res.json(created);
        } catch (e) {
            console.error('create error:', e);
            return next(ApiError.badRequest('Не вдалося створити лікаря'));
        }
    }

    async update(req, res, next) {
        try {
            const item = await Doctor.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Лікаря не знайдено'));
            await item.update(req.body);
            return res.json(item);
        } catch (e) {
            console.error('update error:', e);
            return next(ApiError.internal('Помилка оновлення лікаря'));
        }
    }

    async delete(req, res, next) {
        try {
            const item = await Doctor.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Лікаря не знайдено'));
            await item.destroy();
            return res.json({ message: 'Лікаря видалено' });
        } catch (e) {
            console.error('delete error:', e);
            return next(ApiError.internal('Помилка видалення лікаря'));
        }
    }
}

module.exports = new DoctorController();
