const { Doctor, Appointment, Patient, LabTest, Review, DoctorSchedule, MedicalService, FinancialReport } = require('../models/models');
const ApiError = require('../error/ApiError');
const { fn, col, Op, literal } = require('sequelize');
const { startOfWeek, endOfWeek } = require('date-fns');

class AnalyticsController {
  async topDoctors(req, res, next) {
    try {
      const { hospitalId } = req.query;
      if (req.user.role !== 'Admin') return next(ApiError.forbidden('Доступ лише для адміністратора'));
      if (!hospitalId) return next(ApiError.badRequest('Потрібен hospitalId'));

      const doctors = await Appointment.findAll({
        include: {
          model: Doctor,
          where: { hospital_id: hospitalId },
          attributes: ['first_name', 'last_name']
        },
        attributes: ['doctor_id', [fn('COUNT', col('Appointment.id')), 'appointments']],
        group: ['doctor_id', 'Doctor.id'],
        order: [[literal('appointments'), 'DESC']],
        limit: 5,
      });

      return res.json(doctors);
    } catch (e) {
      console.error('topDoctors error:', e);
      return next(ApiError.internal('Не вдалося отримати топ лікарів'));
    }
  }

  async weeklyAppointments(req, res, next) {
    try {
      const { hospitalId } = req.query;
      if (req.user.role !== 'Admin') return next(ApiError.forbidden('Доступ лише для адміністратора'));
      if (!hospitalId) return next(ApiError.badRequest('Потрібен hospitalId'));

      const today = new Date();
      const start = startOfWeek(today, { weekStartsOn: 1 });
      const end = endOfWeek(today, { weekStartsOn: 1 });

      const visits = await Appointment.findAll({
        include: {
          model: DoctorSchedule,
          where: { appointment_date: { [Op.between]: [start, end] } },
          attributes: ['appointment_date'],
          include: {
            model: Doctor,
            where: { hospital_id: hospitalId },
            attributes: []
          }
        },
        attributes: [
          [fn('DATE', col('DoctorSchedule.appointment_date')), 'day'],
          [fn('COUNT', col('Appointment.id')), 'count']
        ],
        group: ['day'],
        order: [['day', 'ASC']],
        raw: true
      });
      

      return res.json(visits);
    } catch (e) {
      console.error('weeklyAppointments error:', e);
      return next(ApiError.internal('Не вдалося отримати статистику за тиждень'));
    }
  }

  async monthlyIncome(req, res, next) {
    try {
      const { hospitalId } = req.query;
      if (req.user.role !== 'Admin') return next(ApiError.forbidden('Доступ лише для адміністратора'));
      if (!hospitalId) return next(ApiError.badRequest('Потрібен hospitalId'));

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const income = await FinancialReport.findAll({
        where: {
          hospital_id: hospitalId,
          report_date: {
            [Op.and]: [
              literal(`EXTRACT(MONTH FROM report_date) = ${currentMonth}`),
              literal(`EXTRACT(YEAR FROM report_date) = ${currentYear}`)
            ]
          }
        },
        attributes: [[fn('SUM', col('total_income')), 'income']],
        raw: true
      });

      return res.json({ income: parseFloat(income[0].income || 0).toFixed(2) });
    } catch (e) {
      console.error('monthlyIncome error:', e);
      return next(ApiError.internal('Не вдалося отримати дохід за місяць'));
    }
  }

  async averageDoctorRating(req, res, next) {
    try {
      const { hospitalId } = req.query;
      if (req.user.role !== 'Admin') return next(ApiError.forbidden('Доступ лише для адміністратора'));
      if (!hospitalId) return next(ApiError.badRequest('Потрібен hospitalId'));

      const rating = await Review.findAll({
        include: {
          model: Doctor,
          as: 'doctorTarget',
          where: { hospital_id: hospitalId },
          attributes: []
        },
        where: { target_type: 'Doctor' },
        attributes: [[fn('AVG', col('rating')), 'average']],
        raw: true
      });

      return res.json({ averageRating: parseFloat(rating[0].average || 0).toFixed(2) });
    } catch (e) {
      console.error('averageDoctorRating error:', e);
      return next(ApiError.internal('Не вдалося отримати середню оцінку'));
    }
  }

  async mostActivePatients(req, res, next) {
    try {
      const { hospitalId } = req.query;
      if (req.user.role !== 'Admin') return next(ApiError.forbidden('Доступ лише для адміністратора'));
      if (!hospitalId) return next(ApiError.badRequest('Потрібен hospitalId'));

      const patients = await Appointment.findAll({
        include: {
          model: Patient,
          where: { hospital_id: hospitalId },
          attributes: ['first_name', 'last_name']
        },
        attributes: ['patient_id', [fn('COUNT', col('Appointment.id')), 'visits']],
        group: ['patient_id', 'Patient.id'],
        order: [[literal('visits'), 'DESC']],
        limit: 5
      });

      return res.json(patients);
    } catch (e) {
      console.error('mostActivePatients error:', e);
      return next(ApiError.internal('Не вдалося отримати активних пацієнтів'));
    }
  }

  async mostRequestedLabTests(req, res, next) {
    try {
      const { hospitalId } = req.query;
      if (req.user.role !== 'Admin') return next(ApiError.forbidden('Тільки для адміністратора'));
      if (!hospitalId) return next(ApiError.badRequest('Потрібен hospitalId'));

      const tests = await LabTest.findAll({
        include: {
          model: Doctor,
          where: { hospital_id: hospitalId },
          attributes: ['first_name', 'last_name']
        },
        attributes: ['doctor_id', [fn('COUNT', col('LabTest.id')), 'total_tests']],
        group: ['doctor_id', 'Doctor.id'],
        order: [[literal('total_tests'), 'DESC']],
        limit: 5
      });

      return res.json(tests);
    } catch (e) {
      console.error('mostRequestedLabTests error:', e);
      return next(ApiError.internal('Не вдалося отримати статистику по аналізах'));
    }
  }

  async mostUsedMedicalServices(req, res, next) {
    try {
      const { hospitalId } = req.query;
      if (req.user.role !== 'Admin') return next(ApiError.forbidden('Тільки для адміністратора'));
      if (!hospitalId) return next(ApiError.badRequest('Потрібен hospitalId'));

      const services = await MedicalService.findAll({
        include: {
          model: Doctor,
          where: { hospital_id: hospitalId },
          attributes: ['first_name', 'last_name']
        },
        attributes: ['doctor_id', [fn('COUNT', col('MedicalService.id')), 'uses']],
        group: ['doctor_id', 'Doctor.id'],
        order: [[literal('uses'), 'DESC']],
        limit: 5
      });

      return res.json(services);
    } catch (e) {
      console.error('mostUsedMedicalServices error:', e);
      return next(ApiError.internal('Не вдалося отримати статистику по медичних послугах'));
    }
  }
}

module.exports = new AnalyticsController();