const { FinancialReport } = require('../models/models');
const ApiError = require('../error/ApiError');

class FinancialReportController {
    async getAll(req, res, next) {
        try {
            const items = await FinancialReport.findAll();
            return res.json(items);
        } catch (e) {
            console.error('getAll error:', e);
            return next(ApiError.internal('Не вдалося отримати фінансові звіти'));
        }
    }

    async getById(req, res, next) {
        try {
            const item = await FinancialReport.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Фінансовий звіт не знайдено'));
            return res.json(item);
        } catch (e) {
            console.error('getById error:', e);
            return next(ApiError.internal('Помилка отримання фінансового звіту'));
        }
    }

    async create(req, res, next) {
        try {
            const created = await FinancialReport.create(req.body);
            return res.json(created);
        } catch (e) {
            console.error('create error:', e);
            return next(ApiError.badRequest('Не вдалося створити фінансовий звіт'));
        }
    }

    async update(req, res, next) {
        try {
            const item = await FinancialReport.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Фінансовий звіт не знайдено'));
            await item.update(req.body);
            return res.json(item);
        } catch (e) {
            console.error('update error:', e);
            return next(ApiError.internal('Помилка оновлення фінансового звіту'));
        }
    }

    async delete(req, res, next) {
        try {
            const item = await FinancialReport.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Фінансовий звіт не знайдено'));
            await item.destroy();
            return res.json({ message: 'Фінансовий звіт видалено' });
        } catch (e) {
            console.error('delete error:', e);
            return next(ApiError.internal('Помилка видалення фінансового звіту'));
        }
    }
}

module.exports = new FinancialReportController();
