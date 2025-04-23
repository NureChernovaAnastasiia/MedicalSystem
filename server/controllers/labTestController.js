const { LabTest, Patient, Doctor, LabTestSchedule, HospitalLabService, LabTestInfo } = require('../models/models');
const ApiError = require('../error/ApiError');
const PDFDocument = require('pdfkit');
const path = require('path');

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

  // ✅ Правильно оформлений метод класу
  async downloadPDF(req, res, next) {
    try {
      const { id } = req.params;
      const labTest = await LabTest.findByPk(id, {
        include: [Patient, Doctor],
      });

      if (!labTest) {
        return next(ApiError.notFound('Аналіз не знайдено'));
      }

      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=lab-test-${id}.pdf`);
      doc.pipe(res);

      // 🔤 Підключаємо український шрифт
      doc.registerFont('UkrainianFont', path.join(__dirname, '../assets/fonts/DejaVuSans.ttf'));
      doc.font('UkrainianFont');

      // Заголовок
      doc.fontSize(20).text('Звіт про лабораторний аналіз', { align: 'center' });
      doc.moveDown();

      // Деталі
      doc.fontSize(12).text(`Пацієнт: ${labTest.Patient?.last_name} ${labTest.Patient?.first_name}`);
      doc.text(`Лікар: ${labTest.Doctor?.last_name} ${labTest.Doctor?.first_name}`);
      doc.text(`Дата: ${new Date().toLocaleDateString('uk-UA')}`);
      doc.moveDown();

      doc.text('Результати:', { underline: true });
      doc.text(labTest.results || 'Результати відсутні');
      doc.moveDown();

      doc.text('Примітки:', { underline: true });
      doc.text(labTest.notes || 'Без приміток');

      doc.end();
    } catch (e) {
      console.error('downloadPDF error:', e);
      return next(ApiError.internal('Не вдалося згенерувати PDF'));
    }
  }
}

module.exports = new LabTestController();
