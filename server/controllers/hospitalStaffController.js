const { HospitalStaff } = require('../models/models');
const ApiError = require('../error/ApiError');

class HospitalStaffController {
    async getAll(req, res, next) {
        try {
            const items = await HospitalStaff.findAll();
            return res.json(items);
        } catch (e) {
            console.error('getAll error:', e);
            return next(ApiError.internal('Не вдалося отримати список персоналу лікарні'));
        }
    }

    async getById(req, res, next) {
        try {
            const item = await HospitalStaff.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Працівника не знайдено'));
            return res.json(item);
        } catch (e) {
            console.error('getById error:', e);
            return next(ApiError.internal('Помилка отримання працівника'));
        }
    }

    async create(req, res, next) {
        try {
            const created = await HospitalStaff.create(req.body);
            return res.json(created);
        } catch (e) {
            console.error('create error:', e);
            return next(ApiError.badRequest('Не вдалося створити працівника'));
        }
    }

    async update(req, res, next) {
        try {
            const item = await HospitalStaff.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Працівника не знайдено'));
            await item.update(req.body);
            return res.json(item);
        } catch (e) {
            console.error('update error:', e);
            return next(ApiError.internal('Помилка оновлення працівника'));
        }
    }

    async delete(req, res, next) {
        try {
            const item = await HospitalStaff.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Працівника не знайдено'));
            await item.destroy();
            return res.json({ message: 'Працівника видалено' });
        } catch (e) {
            console.error('delete error:', e);
            return next(ApiError.internal('Помилка видалення працівника'));
        }
    }
}

module.exports = new HospitalStaffController();
