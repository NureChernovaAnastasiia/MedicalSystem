const { Patient, User, Doctor } = require("../models/models");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");

class PatientController {
  async getAll(req, res, next) {
    try {
      const patients = await Patient.findAll();
      return res.json(patients);
    } catch (e) {
      console.error("getAll error:", e);
      return next(ApiError.internal("Не вдалося отримати список пацієнтів"));
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const patient = await Patient.findByPk(id);
      if (!patient) return next(ApiError.notFound("Пацієнта не знайдено"));

      // Пацієнт бачить лише себе
      if (req.user.role === "Patient" && req.user.id !== patient.user_id) {
        return next(ApiError.forbidden("Немає доступу"));
      }

      return res.json(patient);
    } catch (e) {
      console.error("getById error:", e);
      return next(ApiError.internal("Помилка отримання пацієнта"));
    }
  }

  async create(req, res, next) {
    try {
      const { user_id, first_name, last_name, middle_name, email, hospital_id } = req.body;
  
      if (!user_id || !first_name || !last_name || !email) {
        return next(ApiError.badRequest('Обовʼязкові поля відсутні'));
      }
  
      const user = await User.findByPk(user_id);
      if (!user || user.role !== 'Patient') {
        return next(ApiError.badRequest('User не знайдено або роль не Patient'));
      }
  
      let finalHospitalId = hospital_id;
  
      // Якщо створює лікар — лікарня береться автоматично
      if (req.user.role === 'Doctor') {
        const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
        if (!doctor) return next(ApiError.badRequest('Лікаря не знайдено'));
        finalHospitalId = doctor.hospital_id;
      }
  
      // Якщо адміністратор і не передав hospital_id
      if (req.user.role === 'Admin' && !hospital_id) {
        return next(ApiError.badRequest('Для Admin потрібно вказати hospital_id'));
      }
  
      const newPatient = await Patient.create({
        user_id,
        hospital_id: finalHospitalId,
        first_name,
        last_name,
        middle_name,
        email,
      });
  
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
      if (!patient) return next(ApiError.notFound("Пацієнта не знайдено"));

      const user = await User.findByPk(patient.user_id);
      if (!user) return next(ApiError.badRequest("Користувача не знайдено"));

      if (req.user.role === "Patient") {
        if (req.user.id !== patient.user_id) {
          return next(ApiError.forbidden("Немає доступу"));
        }

        const { email, phone, photo_url, password } = req.body;
        if (email) {
          user.email = email;
          patient.email = email;
        }
        if (phone) patient.phone = phone;
        if (photo_url) patient.photo_url = photo_url;
        if (password) user.password = await bcrypt.hash(password, 5);

        await user.save();
        await patient.save();
        return res.json(patient);
      }

      if (req.user.role === "Doctor") {
        const doctor = await Doctor.findOne({
          where: { user_id: req.user.id },
        });
        if (doctor.hospital_id !== patient.hospital_id) {
          return next(
            ApiError.forbidden("Пацієнт не належить до цієї лікарні")
          );
        }

        await patient.update(req.body);
        return res.json(patient);
      }

      if (req.user.role === "Admin") {
        await patient.update(req.body);
        return res.json(patient);
      }

      return next(ApiError.forbidden("Немає доступу"));
    } catch (e) {
      console.error("update error:", e);
      return next(ApiError.internal("Помилка оновлення пацієнта"));
    }
  }

  async delete(req, res, next) {
    try {
      if (req.user.role !== "Doctor" && req.user.role !== "Admin") {
        return next(ApiError.forbidden("Немає доступу"));
      }

      const { id } = req.params;
      const patient = await Patient.findByPk(id);
      if (!patient) return next(ApiError.notFound("Пацієнта не знайдено"));

      // Якщо лікар — перевірка лікарні
      if (req.user.role === "Doctor") {
        const doctor = await Doctor.findOne({
          where: { user_id: req.user.id },
        });
        if (doctor.hospital_id !== patient.hospital_id) {
          return next(ApiError.forbidden("Немає доступу до цього пацієнта"));
        }
      }

      await patient.destroy();
      return res.json({ message: "Пацієнта видалено" });
    } catch (e) {
      console.error("delete error:", e);
      return next(ApiError.internal("Помилка видалення пацієнта"));
    }
  }
}

module.exports = new PatientController();
