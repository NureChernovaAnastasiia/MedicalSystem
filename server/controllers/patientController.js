const { Patient } = require('../models/models');
const ApiError = require('../error/ApiError');

class PatientController {
    async getAll(req, res, next) {
        try {
            const patients = await Patient.findAll();
            return res.json(patients);
        } catch (e) {
            console.error('getAll error:', e);
            return next(ApiError.internal('Не вдалося отримати список пацієнтів'));
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const patient = await Patient.findByPk(id);
            if (!patient) return next(ApiError.notFound('Пацієнта не знайдено'));
            return res.json(patient);
        } catch (e) {
            console.error('getById error:', e);
            return next(ApiError.internal('Помилка отримання пацієнта'));
        }
    }

    async create(req, res, next) {
        try {
            const newPatient = await Patient.create(req.body);
            return res.json(newPatient);
        } catch (e) {
            console.error('create error:', e);
            return next(ApiError.badRequest('Не вдалося створити пацієнта'));
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const patient = await Patient.findByPk(id);
            if (!patient) return next(ApiError.notFound('Пацієнта не знайдено'));
            await patient.update(req.body);
            return res.json(patient);
        } catch (e) {
            console.error('update error:', e);
            return next(ApiError.internal('Помилка оновлення пацієнта'));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const patient = await Patient.findByPk(id);
            if (!patient) return next(ApiError.notFound('Пацієнта не знайдено'));
            await patient.destroy();
            return res.json({ message: 'Пацієнта видалено' });
        } catch (e) {
            console.error('delete error:', e);
            return next(ApiError.internal('Помилка видалення пацієнта'));
        }
    }
}

module.exports = new PatientController();
