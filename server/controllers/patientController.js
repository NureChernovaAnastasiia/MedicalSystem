const { Patient, User, Doctor, Hospital } = require("../models/models");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const { updateUserCredentials } = require("../utils/userUtils");

class PatientController {
  async getAll(req, res, next) {
    try {
      const patients = await Patient.findAll({ include: [Hospital] });
      return res.json(patients);
    } catch (e) {
      console.error("getAll error:", e);
      return next(ApiError.internal("Не вдалося отримати список пацієнтів"));
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const patient = await Patient.findByPk(id, { include: [Hospital] });
      if (!patient) return next(ApiError.notFound("Пацієнта не знайдено"));

      if (req.user.role === "Patient" && req.user.id !== patient.user_id) {
        return next(ApiError.forbidden("Немає доступу"));
      }

      return res.json(patient);
    } catch (e) {
      console.error("getById error:", e);
      return next(ApiError.internal("Помилка отримання пацієнта"));
    }
  }

  async getByUserId(req, res, next) {
    try {
      const { userId } = req.params;

      const patient = await Patient.findOne({
        where: { user_id: userId },
        include: [Hospital],
      });

      if (!patient) return next(ApiError.notFound("Пацієнта не знайдено"));

      if (
        req.user.role === "Doctor" ||
        req.user.role === "Admin" ||
        req.user.id === patient.user_id
      ) {
        return res.json(patient);
      }

      return next(
        ApiError.forbidden("Недостатньо прав для перегляду пацієнта")
      );
    } catch (e) {
      console.error("getByUserId error:", e);
      return next(ApiError.internal("Помилка отримання пацієнта за user_id"));
    }
  }

  async create(req, res, next) {
    try {
      const {
        user_id,
        first_name,
        last_name,
        middle_name,
        email,
        hospital_id,
        doctor_id,
        birth_date,
        gender,
        phone,
        address,
        blood_type,
        chronic_conditions,
        allergies,
      } = req.body;

      if (!user_id || !first_name || !last_name || !email) {
        return next(ApiError.badRequest("Обовʼязкові поля відсутні"));
      }

      const user = await User.findByPk(user_id);
      if (!user || user.role !== "Patient") {
        return next(
          ApiError.badRequest("User не знайдено або роль не Patient")
        );
      }

      let finalHospitalId = hospital_id;
      let finalDoctorId = doctor_id;

      if (req.user.role === "Doctor") {
        const doctor = await Doctor.findOne({
          where: { user_id: req.user.id },
        });
        if (!doctor) return next(ApiError.badRequest("Лікаря не знайдено"));
        finalHospitalId = doctor.hospital_id;
        finalDoctorId = doctor.id;
      }

      if (req.user.role === "Admin" && !hospital_id) {
        return next(
          ApiError.badRequest("Для Admin потрібно вказати hospital_id")
        );
      }

      const newPatient = await Patient.create({
        user_id,
        hospital_id: finalHospitalId,
        doctor_id: finalDoctorId || null,
        first_name,
        last_name,
        middle_name,
        email,
        birth_date,
        gender,
        phone,
        address,
        blood_type,
        chronic_conditions,
        allergies,
      });

      return res.json(newPatient);
    } catch (e) {
      console.error("create error:", e);
      return next(ApiError.badRequest("Не вдалося створити пацієнта"));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const patient = await Patient.findByPk(id);
      if (!patient) return next(ApiError.notFound("Пацієнта не знайдено"));

      const user = await User.findByPk(patient.user_id);
      if (!user) return next(ApiError.badRequest("Користувача не знайдено"));

      switch (req.user.role) {
        case "Patient":
          return this.updateAsPatient(req, res, next, user, patient);
        case "Doctor":
          return this.updateAsDoctor(req, res, next, patient);
        case "Admin":
          return this.updateAsAdmin(req, res, next, user, patient);
        default:
          return next(ApiError.forbidden("Немає доступу"));
      }
    } catch (e) {
      console.error("❌ update error:", e);
      return next(ApiError.internal("Помилка оновлення пацієнта"));
    }
  }

  async updateAsPatient(req, res, next, user, patient) {
    try {
      if (req.user.id !== patient.user_id)
        return next(ApiError.forbidden("Немає доступу"));

      const genderMap = {
        female: "Female",
        male: "Male",
        other: "Other",
        жіноча: "Female",
        чоловіча: "Male",
      };
      if (req.body.gender && genderMap[req.body.gender.toLowerCase()]) {
        req.body.gender = genderMap[req.body.gender.toLowerCase()];
      }

      await updateUserCredentials(user, req.body, next);

      Object.assign(patient, req.body);
      await patient.save();

      return res.json(patient);
    } catch (e) {
      console.error("updateAsPatient error:", e);
      return next(ApiError.internal("Помилка оновлення пацієнта"));
    }
  }

  async updateAsDoctor(req, res, next, patient) {
    try {
      const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
      if (!doctor) return next(ApiError.badRequest("Доктор не знайдений"));
      if (doctor.hospital_id !== patient.hospital_id)
        return next(ApiError.forbidden("Пацієнт не належить до цієї лікарні"));

      Object.assign(patient, req.body);
      await patient.save();
      return res.json(patient);
    } catch (e) {
      console.error("updateAsDoctor error:", e);
      return next(ApiError.internal("Помилка оновлення пацієнта (Doctor)"));
    }
  }

  async updateAsAdmin(req, res, next, user, patient) {
    try {
      if (req.body.email && req.body.email !== user.email) {
        const existing = await User.findOne({
          where: { email: req.body.email },
        });
        if (existing && existing.id !== user.id)
          return next(ApiError.badRequest("Цей email вже зайнятий"));
        user.email = req.body.email;
        patient.email = req.body.email;
      }

      Object.assign(patient, req.body);
      await user.save();
      await patient.save();
      return res.json(patient);
    } catch (e) {
      console.error("updateAsAdmin error:", e);
      return next(ApiError.internal("Помилка оновлення пацієнта (Admin)"));
    }
  }

  async updatePhoto(req, res, next) {
    try {
      const { id } = req.params;
      const { photo_url } = req.body;
      if (!photo_url)
        return next(ApiError.badRequest("Поле photo_url обовʼязкове"));

      const patient = await Patient.findByPk(id);
      if (!patient) return next(ApiError.notFound("Пацієнта не знайдено"));
      if (req.user.role !== "Patient" || req.user.id !== patient.user_id)
        return next(ApiError.forbidden("Немає доступу до редагування фото"));

      patient.photo_url = photo_url;
      await patient.save();

      return res.json({ message: "Фото оновлено", photo_url });
    } catch (e) {
      console.error("updatePhoto error:", e);
      return next(ApiError.internal("Не вдалося оновити фото пацієнта"));
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

  async getByDoctor(req, res, next) {
    try {
      const { doctorId } = req.params;

      if (req.user.role === "Doctor") {
        const doctor = await Doctor.findOne({
          where: { user_id: req.user.id },
        });
        if (!doctor || doctor.id !== parseInt(doctorId)) {
          return next(
            ApiError.forbidden("Немає доступу до пацієнтів іншого лікаря")
          );
        }
      }

      if (req.user.role !== "Admin" && req.user.role !== "Doctor") {
        return next(ApiError.forbidden("Недостатньо прав"));
      }

      const patients = await Patient.findAll({
        where: { doctor_id: doctorId },
        include: [Hospital],
      });
      return res.json(patients);
    } catch (e) {
      console.error("getByDoctor error:", e);
      return next(ApiError.internal("Не вдалося отримати пацієнтів лікаря"));
    }
  }
  async getByHospital(req, res, next) {
    try {
      const { hospitalId } = req.params;

      // Для Doctor — перевіряємо, що він з цієї лікарні
      if (req.user.role === "Doctor") {
        const doctor = await Doctor.findOne({
          where: { user_id: req.user.id },
        });
        if (!doctor || doctor.hospital_id !== parseInt(hospitalId)) {
          return next(ApiError.forbidden("Немає доступу до цієї лікарні"));
        }
      }

      // Admin має повний доступ
      if (req.user.role !== "Admin" && req.user.role !== "Doctor") {
        return next(ApiError.forbidden("Недостатньо прав"));
      }

      const patients = await Patient.findAll({
        where: { hospital_id: hospitalId },
        include: [Hospital],
      });

      return res.json(patients);
    } catch (e) {
      console.error("getByHospital error:", e);
      return next(ApiError.internal("Не вдалося отримати пацієнтів лікарні"));
    }
  }
}

module.exports = new PatientController();
