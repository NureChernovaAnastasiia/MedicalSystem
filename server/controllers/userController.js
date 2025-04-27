const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Doctor, Patient } = require("../models/models");
const ApiError = require("../error/ApiError");

const generateJwt = (id, email, role) => {
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables");
  }
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
};

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password, role, username, hospital_id, doctor_id } = req.body;

      if (!email || !password || !role) {
        return next(ApiError.badRequest("Некоректний email, пароль або роль"));
      }

      await this._checkExistingUser(email, next);
      await this._checkRegistrationPermissions(role, req, next);

      const hashPassword = await bcrypt.hash(password, 5);
      const user = await User.create({
        username: username || email,
        email,
        password: hashPassword,
        role,
      });

      if (role === "Doctor") {
        await this._createDoctor(user, username, email, hospital_id, next);
      }

      if (role === "Patient") {
        await this._createPatient(user, username, email, req, doctor_id, next);
      }

      const token = generateJwt(user.id, user.email, user.role);
      return res.json({ token });
      
    } catch (e) {
      console.error("❌ registration error:", e.message);
      return next(ApiError.internal("Помилка реєстрації"));
    }
  }

  async _checkExistingUser(email, next) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(ApiError.badRequest("Користувач з таким email вже існує"));
    }
  }

  async _checkRegistrationPermissions(role, req, next) {
    const userCount = await User.count();
    if (userCount === 0 && role !== "Admin") {
      return next(ApiError.forbidden("Першим може бути тільки адміністратор"));
    }
    if (userCount > 0 && !req.user) {
      return next(ApiError.forbidden("Потрібна авторизація"));
    }
  }

  async _createDoctor(user, username, email, hospital_id, next) {
    if (!hospital_id) {
      return next(ApiError.badRequest("Для лікаря потрібно вказати hospital_id"));
    }
    const doctor = await Doctor.create({
      user_id: user.id,
      hospital_id,
      first_name: username || email,
      last_name: "",
      middle_name: "",
      email,
    });
    await HospitalStaff.create({
      user_id: user.id,
      hospital_id,
      first_name: doctor.first_name,
      last_name: doctor.last_name,
      middle_name: doctor.middle_name,
      position: "Doctor",
      email,
    });
  }

  async _createPatient(user, username, email, req, doctor_id, next) {
    if (!req.user || (req.user.role !== "Doctor" && req.user.role !== "Admin")) {
      return next(ApiError.forbidden("Тільки лікар або адміністратор може створити пацієнта"));
    }

    let finalDoctorId = doctor_id;
    if (req.user.role === "Doctor") {
      const doctor = await Doctor.findOne({ where: { user_id: req.user.id } });
      if (!doctor) {
        return next(ApiError.badRequest("Лікаря не знайдено"));
      }
      finalDoctorId = doctor.id;
    }

    const doctor = await Doctor.findByPk(finalDoctorId);
    if (!doctor) {
      return next(ApiError.badRequest("Лікаря не знайдено"));
    }

    await Patient.create({
      user_id: user.id,
      doctor_id: finalDoctorId,
      hospital_id: doctor.hospital_id,
      first_name: username || email,
      last_name: "",
      middle_name: "",
      email,
    });
  }

  async _createAdmin(user, username, email, hospital_id, next) {
    if (!hospital_id) {
      return next(ApiError.badRequest("Для адміністратора потрібно вказати hospital_id"));
    }
    await HospitalStaff.create({
      user_id: user.id,
      hospital_id,
      first_name: username || email,
      last_name: "",
      middle_name: "",
      position: "Admin",
      email,
    });
  }  

  async login(req, res, next) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return next(ApiError.badRequest("Користувача не знайдено"));

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return next(ApiError.badRequest("Невірний пароль"));

      const token = generateJwt(user.id, user.email, user.role);
      return res.json({ token });
    } catch (e) {
      console.error("❌ login error:", e.message);
      return next(ApiError.internal("Помилка входу"));
    }
  }

  async check(req, res, next) {
    try {
      const token = generateJwt(req.user.id, req.user.email, req.user.role);
      return res.json({ token, role: req.user.role });
    } catch (e) {
      console.error("❌ check error:", e.message);
      return next(ApiError.internal("Помилка перевірки токена"));
    }
  }

  async getUserById(req, res, next) {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) return next(ApiError.badRequest("Користувача не знайдено"));

      if (req.user.role === "Patient" && req.user.id != id) {
        return next(ApiError.forbidden("Немає доступу"));
      }

      return res.json(user);
    } catch (e) {
      console.error("❌ getUserById error:", e.message);
      return next(ApiError.internal("Помилка отримання користувача"));
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    const { email, password } = req.body;

    try {
      const user = await User.findByPk(id);
      if (!user) return next(ApiError.badRequest("Користувача не знайдено"));

      if (req.user.role === "Patient" && req.user.id != id) {
        return next(ApiError.forbidden("Немає доступу"));
      }

      user.email = email || user.email;
      if (password) {
        user.password = await bcrypt.hash(password, 5);
      }

      await user.save();
      return res.json(user);
    } catch (e) {
      console.error("❌ update error:", e.message);
      return next(ApiError.internal("Помилка оновлення"));
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;
    try {
      if (req.user.role !== "Admin") {
        return next(
          ApiError.forbidden("Тільки адміністратор може видаляти користувачів")
        );
      }

      const user = await User.findByPk(id);
      if (!user) return next(ApiError.badRequest("Користувача не знайдено"));

      await user.destroy();
      return res.json({ message: "Користувача видалено" });
    } catch (e) {
      console.error("❌ delete error:", e.message);
      return next(ApiError.internal("Помилка видалення"));
    }
  }
}

module.exports = new UserController();
