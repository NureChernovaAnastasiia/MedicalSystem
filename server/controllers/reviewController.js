const { Review } = require('../models/models');
const ApiError = require('../error/ApiError');

class ReviewController {
    async getAll(req, res, next) {
        try {
            const items = await Review.findAll();
            return res.json(items);
        } catch (e) {
            console.error('getAll error:', e);
            return next(ApiError.internal('Не вдалося отримати список відгуків'));
        }
    }

    async getById(req, res, next) {
        try {
            const item = await Review.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Відгук не знайдено'));
            return res.json(item);
        } catch (e) {
            console.error('getById error:', e);
            return next(ApiError.internal('Помилка отримання відгуку'));
        }
    }

    async create(req, res, next) {
        try {
            const created = await Review.create(req.body);
            return res.json(created);
        } catch (e) {
            console.error('create error:', e);
            return next(ApiError.badRequest('Не вдалося створити відгук'));
        }
    }

    async update(req, res, next) {
        try {
            const item = await Review.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Відгук не знайдено'));
            await item.update(req.body);
            return res.json(item);
        } catch (e) {
            console.error('update error:', e);
            return next(ApiError.internal('Помилка оновлення відгуку'));
        }
    }

    async delete(req, res, next) {
        try {
            const item = await Review.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Відгук не знайдено'));
            await item.destroy();
            return res.json({ message: 'Відгук видалено' });
        } catch (e) {
            console.error('delete error:', e);
            return next(ApiError.internal('Помилка видалення відгуку'));
        }
    }
}

module.exports = new ReviewController();
