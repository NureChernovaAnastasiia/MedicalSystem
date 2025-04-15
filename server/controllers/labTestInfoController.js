const { LabTestInfo } = require('../models/models');
const ApiError = require('../error/ApiError');

class LabTestInfoController {
    async getAll(req, res, next) {
        try {
            const items = await LabTestInfo.findAll();
            return res.json(items);
        } catch (e) {
            console.error('getAll error:', e);
            return next(ApiError.internal('Не вдалося отримати список лабораторних тестів'));
        }
    }

    async getById(req, res, next) {
        try {
            const item = await LabTestInfo.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Лабораторний тест не знайдено'));
            return res.json(item);
        } catch (e) {
            console.error('getById error:', e);
            return next(ApiError.internal('Помилка отримання лабораторного тесту'));
        }
    }

    async create(req, res, next) {
        try {
            const created = await LabTestInfo.create(req.body);
            return res.json(created);
        } catch (e) {
            console.error('create error:', e);
            return next(ApiError.badRequest('Не вдалося створити лабораторний тест'));
        }
    }

    async update(req, res, next) {
        try {
            const item = await LabTestInfo.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Лабораторний тест не знайдено'));
            await item.update(req.body);
            return res.json(item);
        } catch (e) {
            console.error('update error:', e);
            return next(ApiError.internal('Помилка оновлення лабораторного тесту'));
        }
    }

    async delete(req, res, next) {
        try {
            const item = await LabTestInfo.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Лабораторний тест не знайдено'));
            await item.destroy();
            return res.json({ message: 'Лабораторний тест видалено' });
        } catch (e) {
            console.error('delete error:', e);
            return next(ApiError.internal('Помилка видалення лабораторного тесту'));
        }
    }
}

module.exports = new LabTestInfoController();
