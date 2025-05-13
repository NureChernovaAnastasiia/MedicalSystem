const { Appointment, Doctor, Patient, DoctorSchedule } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class AppointmentController {
  // 🔍 Отримати всі записи (тільки Admin)
  async getAll(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Тільки адміністратор може переглядати всі записи'));
      }

      const appointments = await Appointment.findAll({
        include: [Doctor, Patient, DoctorSchedule]
      });

      return res.json(AppointmentController._mapStatus(appointments));
    } catch (e) {
      console.error('getAll error:', e);
      return next(ApiError.internal('Не вдалося отримати записи'));
    }
  }

  // 🔍 Отримати запис по ID (пацієнт може тільки свій)
  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const appointment = await Appointment.findByPk(id, {
        include: [Doctor, Patient, DoctorSchedule]
      });

      if (!appointment) return next(ApiError.notFound('Запис не знайдено'));

      if (req.user.role === 'Patient') {
        const patient = await Patient.findOne({ where: { user_id: req.user.id } });
        if (!patient || patient.id !== appointment.patient_id) {
          return next(ApiError.forbidden('Немає доступу до чужого запису'));
        }
      }

      return res.json(AppointmentController._mapStatus([appointment])[0]);
    } catch (e) {
      console.error('getById error:', e);
      return next(ApiError.internal('Не вдалося отримати запис'));
    }
  }
  
// ✅ Create appointment — only doctor_schedule_id is required to get the date
async create(req, res, next) {
    try {
      const { patient_id, doctor_id, doctor_schedule_id, status, notes } = req.body;
  
      if (!patient_id || !doctor_id || !doctor_schedule_id) {
        return next(ApiError.badRequest('Required fields: patient_id, doctor_id, doctor_schedule_id'));
      }
  
      // 🔎 Get schedule
      const schedule = await DoctorSchedule.findByPk(doctor_schedule_id);
      if (!schedule) return next(ApiError.notFound('Doctor schedule not found'));
  
      // 🔐 Ensure the slot is available
      if (schedule.is_booked) {
        return next(ApiError.badRequest('This time slot is already booked'));
      }
  
      // 📅 Use date from schedule automatically
      const appointment_date = schedule.appointment_date;
  
      // ✅ Create appointment
      const created = await Appointment.create({
        patient_id,
        doctor_id,
        doctor_schedule_id,
        appointment_date,
        status: status || 'Scheduled',
        notes: notes || null,
      });
  
      // 🔁 Update schedule as booked
      await schedule.update({ is_booked: true });
  
      return res.json(created);
    } catch (e) {
      console.error('create error:', e);
      return next(ApiError.internal('Failed to create appointment'));
    }
  }  
  
  // 🔁 Оновити запис (Admin, Doctor)
  async update(req, res, next) {
    try {
      if (!['Admin', 'Doctor'].includes(req.user.role)) {
        return next(ApiError.forbidden('Недостатньо прав для оновлення запису'));
      }

      const appointment = await Appointment.findByPk(req.params.id);
      if (!appointment) return next(ApiError.notFound('Запис не знайдено'));

      await appointment.update(req.body);
      return res.json(appointment);
    } catch (e) {
      console.error('update error:', e);
      return next(ApiError.internal('Не вдалося оновити запис'));
    }
  }

  // ❌ Скасувати запис (тільки пацієнт — свій або адмін)
  async cancel(req, res, next) {
    try {
      const appointment = await Appointment.findByPk(req.params.id);
      if (!appointment) return next(ApiError.notFound('Запис не знайдено'));

      if (req.user.role === 'Patient') {
        const patient = await Patient.findOne({ where: { user_id: req.user.id } });
        if (!patient || patient.id !== appointment.patient_id) {
          return next(ApiError.forbidden('Немає доступу до чужого запису'));
        }
      }

      appointment.status = 'Cancelled';
      await appointment.save();
      await DoctorSchedule.update({ is_booked: false }, { where: { id: appointment.doctor_schedule_id } });

      return res.json({ message: 'Запис скасовано' });
    } catch (e) {
      console.error('cancel error:', e);
      return next(ApiError.internal('Не вдалося скасувати запис'));
    }
  }

  // 🔍 Всі записи пацієнта (пацієнт — свої, лікар/адмін — будь-які)
  async getByPatient(req, res, next) {
    try {
      const { patientId } = req.params;

      if (req.user.role === 'Patient') {
        const patient = await Patient.findOne({ where: { user_id: req.user.id } });
        if (!patient || patient.id !== parseInt(patientId)) {
          return next(ApiError.forbidden('Немає доступу до чужих записів'));
        }
      }

      const items = await Appointment.findAll({
        where: { patient_id: patientId },
        include: [Doctor, DoctorSchedule]
      });

      return res.json(AppointmentController._mapStatus(items));
    } catch (e) {
      console.error('getByPatient error:', e);
      return next(ApiError.internal('Не вдалося отримати записи пацієнта'));
    }
  }

  // 🔍 Всі записи конкретного лікаря
  async getByDoctor(req, res, next) {
    try {
      const { doctorId } = req.params;

      if (req.user.role === 'Doctor') {
        const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
        if (!doctor || doctor.id !== parseInt(doctorId)) {
          return next(ApiError.forbidden('Немає доступу'));
        }
      }

      const appointments = await Appointment.findAll({
        where: { doctor_id: doctorId },
        include: [Patient, DoctorSchedule]
      });

      return res.json(AppointmentController._mapStatus(appointments));
    } catch (e) {
      console.error('getByDoctor error:', e);
      return next(ApiError.internal('Не вдалося отримати записи лікаря'));
    }
  }

  // Додати статус "Минулий" якщо дата < сьогодні
  static _mapStatus(list) {
    const now = new Date();
    return list.map(item => {
      const date = new Date(item.appointment_date);

      let status;
      if (item.status === 'Cancelled') {
        status = 'Cancelled';
      } else if (date < now) {
        status = 'Past';
      } else {
        status = 'Scheduled';
      }

      return { ...item.toJSON(), computed_status: status };
    });
  }
}

module.exports = new AppointmentController();
