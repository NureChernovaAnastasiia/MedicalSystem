const { Prescription } = require('../models/models');
const ApiError = require('../error/ApiError');

class PrescriptionController {
    async getAll(req, res, next) {
        try {
            const items = await Prescription.findAll();
            return res.json(items);
        } catch (e) {
            console.error('getAll error:', e);
            return next(ApiError.internal('Не вдалося отримати список рецептів'));
        }
    }

    async getById(req, res, next) {
        try {
            const item = await Prescription.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Рецепт не знайдено'));
            return res.json(item);
        } catch (e) {
            console.error('getById error:', e);
            return next(ApiError.internal('Помилка отримання рецепту'));
        }
    }

    async create(req, res, next) {
        try {
            const created = await Prescription.create(req.body);
            return res.json(created);
        } catch (e) {
            console.error('create error:', e);
            return next(ApiError.badRequest('Не вдалося створити рецепт'));
        }
    }

    async update(req, res, next) {
        try {
            const item = await Prescription.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Рецепт не знайдено'));
            await item.update(req.body);
            return res.json(item);
        } catch (e) {
            console.error('update error:', e);
            return next(ApiError.internal('Помилка оновлення рецепту'));
        }
    }

    async delete(req, res, next) {
        try {
            const item = await Prescription.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Рецепт не знайдено'));
            await item.destroy();
            return res.json({ message: 'Рецепт видалено' });
        } catch (e) {
            console.error('delete error:', e);
            return next(ApiError.internal('Помилка видалення рецепту'));
        }
    }
}

module.exports = new PrescriptionController();