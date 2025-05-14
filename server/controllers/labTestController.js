const { LabTest, Patient, Doctor, LabTestSchedule, HospitalLabService, LabTestInfo, Hospital } = require('../models/models');
const ApiError = require('../error/ApiError');
const PDFDocument = require('pdfkit');
const path = require('path');
const generateLabTestPdf = require('../utils/labTestPdfGenerator');

class LabTestController {
  async getAll(req, res, next) {
    try {
      const items = await LabTest.findAll({ include: [Patient, Doctor, LabTestSchedule] });
      return res.json(items);
    } catch (e) {
      console.error('getAll error:', e);
      return next(ApiError.internal('Не вдалося отримати список аналізів'));
    }
  }

  async getById(req, res, next) {
    try {
      const item = await LabTest.findByPk(req.params.id, {
        include: [Patient, Doctor, LabTestSchedule],
      });
      if (!item) return next(ApiError.notFound('Аналіз не знайдено'));
      return res.json(item);
    } catch (e) {
      console.error('getById error:', e);
      return next(ApiError.internal('Помилка отримання аналізу'));
    }
  }

  async getByPatient(req, res, next) {
    try {
      const { patientId } = req.params;
      const items = await LabTest.findAll({
        where: { patient_id: patientId },
        include: [Doctor, LabTestSchedule],
      });
      return res.json(items);
    } catch (e) {
      console.error('getByPatient error:', e);
      return next(ApiError.internal('Не вдалося отримати аналізи пацієнта'));
    }
  }

  async getByPatientStatus(req, res, next) {
    try {
      const { patientId, is_ready } = req.query;
      if (typeof is_ready === 'undefined') {
        return next(ApiError.badRequest('Потрібно вказати is_ready (true/false)'));
      }

      const items = await LabTest.findAll({
        where: { patient_id: patientId },
        include: [
          {
            model: LabTestSchedule,
            include: {
              model: HospitalLabService,
              include: [LabTestInfo],
            },
          },
        ],
      });

      const filtered = items.filter(test =>
        test.LabTestSchedule?.HospitalLabService?.LabTestInfo?.is_ready === (is_ready === 'true')
      );

      return res.json(filtered);
    } catch (e) {
      console.error('getByPatientStatus error:', e);
      return next(ApiError.internal('Не вдалося отримати аналізи пацієнта за статусом'));
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

  async downloadPDF(req, res, next) {
  try {
    const { id } = req.params;
    const labTest = await LabTest.findByPk(id, {
       include: [
    {
      model: Patient,
      include: [Hospital], 
    },
    {
      model: Doctor,
      include: [Hospital], 
    }
  ],
    });

    if (!labTest) {
      return next(ApiError.notFound('Аналіз не знайдено'));
    }

    await generateLabTestPdf(labTest, res);
  } catch (e) {
    console.error('downloadPDF error:', e);
    return next(ApiError.internal('Не вдалося згенерувати PDF'));
  }
}
}

module.exports = new LabTestController();
