const { MedicalRecord } = require('../models/models');
const ApiError = require('../error/ApiError');

class MedicalRecordController {
    async getAll(req, res, next) {
        try {
            const items = await MedicalRecord.findAll();
            return res.json(items);
        } catch (e) {
            console.error('getAll error:', e);
            return next(ApiError.internal('Не вдалося отримати список медичних записів'));
        }
    }

    async getById(req, res, next) {
        try {
            const item = await MedicalRecord.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Медичний запис не знайдено'));
            return res.json(item);
        } catch (e) {
            console.error('getById error:', e);
            return next(ApiError.internal('Помилка отримання медичного запису'));
        }
    }

    async create(req, res, next) {
        try {
            const created = await MedicalRecord.create(req.body);
            return res.json(created);
        } catch (e) {
            console.error('create error:', e);
            return next(ApiError.badRequest('Не вдалося створити медичний запис'));
        }
    }

    async update(req, res, next) {
        try {
            const item = await MedicalRecord.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Медичний запис не знайдено'));
            await item.update(req.body);
            return res.json(item);
        } catch (e) {
            console.error('update error:', e);
            return next(ApiError.internal('Помилка оновлення медичного запису'));
        }
    }

    async delete(req, res, next) {
        try {
            const item = await MedicalRecord.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Медичний запис не знайдено'));
            await item.destroy();
            return res.json({ message: 'Медичний запис видалено' });
        } catch (e) {
            console.error('delete error:', e);
            return next(ApiError.internal('Помилка видалення медичного запису'));
        }
    }
}

module.exports = new MedicalRecordController();