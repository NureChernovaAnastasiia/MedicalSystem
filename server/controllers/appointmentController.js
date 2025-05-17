const { Appointment, Doctor, Patient, DoctorSchedule, Hospital } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class AppointmentController {
  async getAll(req, res, next) {
    try {
      if (req.user.role !== 'Admin') {
        return next(ApiError.forbidden('Only admin can view all appointments'));
      }

      const appointments = await Appointment.findAll({
        include: [
          {
            model: Doctor,
            include: [Hospital],
          },
          Patient,
          DoctorSchedule,
        ],
      });

      return res.json(AppointmentController._mapStatus(appointments));
    } catch (e) {
      console.error('getAll error:', e);
      return next(ApiError.internal('Failed to retrieve appointments'));
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const appointment = await Appointment.findByPk(id, {
        include: [
          {
            model: Doctor,
            include: [Hospital],
          },
          Patient,
          DoctorSchedule,
        ],
      });

      if (!appointment) return next(ApiError.notFound('Appointment not found'));

      if (req.user.role === 'Patient') {
        const patient = await Patient.findOne({ where: { user_id: req.user.id } });
        if (!patient || patient.id !== appointment.patient_id) {
          return next(ApiError.forbidden('Access denied'));
        }
      }

      return res.json(AppointmentController._mapStatus([appointment])[0]);
    } catch (e) {
      console.error('getById error:', e);
      return next(ApiError.internal('Failed to get appointment'));
    }
  }

  async create(req, res, next) {
    try {
      const { patient_id, doctor_id, doctor_schedule_id, status, notes } = req.body;

      if (!patient_id || !doctor_id || !doctor_schedule_id) {
        return next(ApiError.badRequest('Required fields: patient_id, doctor_id, doctor_schedule_id'));
      }

      const schedule = await DoctorSchedule.findByPk(doctor_schedule_id);
      if (!schedule) return next(ApiError.notFound('Doctor schedule not found'));

      if (schedule.is_booked) {
        return next(ApiError.badRequest('This time slot is already booked'));
      }

      const appointment_date = schedule.appointment_date;

      const created = await Appointment.create({
        patient_id,
        doctor_id,
        doctor_schedule_id,
        appointment_date,
        status: status || 'Scheduled',
        notes: notes || null,
      });

      await schedule.update({ is_booked: true });

      return res.json(created);
    } catch (e) {
      console.error('create error:', e);
      return next(ApiError.internal('Failed to create appointment'));
    }
  }

  async update(req, res, next) {
    try {
      if (!['Admin', 'Doctor'].includes(req.user.role)) {
        return next(ApiError.forbidden('Insufficient permissions'));
      }

      const appointment = await Appointment.findByPk(req.params.id);
      if (!appointment) return next(ApiError.notFound('Appointment not found'));

      await appointment.update(req.body);
      return res.json(appointment);
    } catch (e) {
      console.error('update error:', e);
      return next(ApiError.internal('Failed to update appointment'));
    }
  }

  async cancel(req, res, next) {
    try {
      const appointment = await Appointment.findByPk(req.params.id);
      if (!appointment) return next(ApiError.notFound('Appointment not found'));

      if (req.user.role === 'Patient') {
        const patient = await Patient.findOne({ where: { user_id: req.user.id } });
        if (!patient || patient.id !== appointment.patient_id) {
          return next(ApiError.forbidden('Access denied'));
        }
      }

      appointment.status = 'Cancelled';
      await appointment.save();
      await DoctorSchedule.update({ is_booked: false }, { where: { id: appointment.doctor_schedule_id } });

      return res.json({ message: 'Appointment cancelled' });
    } catch (e) {
      console.error('cancel error:', e);
      return next(ApiError.internal('Failed to cancel appointment'));
    }
  }

  async getByPatient(req, res, next) {
    try {
      const { patientId } = req.params;

      if (req.user.role === 'Patient') {
        const patient = await Patient.findOne({ where: { user_id: req.user.id } });
        if (!patient || patient.id !== parseInt(patientId)) {
          return next(ApiError.forbidden('Access denied'));
        }
      }

      const items = await Appointment.findAll({
        where: { patient_id: patientId },
        include: [
          {
            model: Doctor,
            include: [Hospital],
          },
          DoctorSchedule,
        ],
      });

      return res.json(AppointmentController._mapStatus(items));
    } catch (e) {
      console.error('getByPatient error:', e);
      return next(ApiError.internal('Failed to retrieve patient appointments'));
    }
  }

  async getByDoctor(req, res, next) {
    try {
      const { doctorId } = req.params;

      if (req.user.role === 'Doctor') {
        const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
        if (!doctor || doctor.id !== parseInt(doctorId)) {
          return next(ApiError.forbidden('Access denied'));
        }
      }

      const appointments = await Appointment.findAll({
        where: { doctor_id: doctorId },
        include: [
          {
            model: Doctor,
            include: [Hospital],
          },
          Patient,
          DoctorSchedule,
        ],
      });

      return res.json(AppointmentController._mapStatus(appointments));
    } catch (e) {
      console.error('getByDoctor error:', e);
      return next(ApiError.internal('Failed to retrieve doctor appointments'));
    }
  }

  async getUpcomingByPatient(req, res, next) {
    try {
      const { patientId } = req.params;

      if (req.user.role === 'Patient') {
        const patient = await Patient.findOne({ where: { user_id: req.user.id } });
        if (!patient || patient.id !== parseInt(patientId)) {
          return next(ApiError.forbidden('Access denied'));
        }
      }

      const now = new Date();

      const upcomingAppointments = await Appointment.findAll({
        where: {
          patient_id: patientId,
          appointment_date: { [Op.gte]: now },
          status: { [Op.ne]: 'Cancelled' },
        },
        include: [
          {
            model: Doctor,
            include: [Hospital],
          },
          DoctorSchedule,
        ],
        order: [['appointment_date', 'ASC']],
      });

      return res.json(AppointmentController._mapStatus(upcomingAppointments));
    } catch (e) {
      console.error('getUpcomingByPatient error:', e);
      return next(ApiError.internal('Failed to retrieve upcoming appointments'));
    }
  }

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