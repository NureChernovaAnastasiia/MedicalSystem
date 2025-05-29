const { HospitalStaff, User, Doctor, Hospital } = require("../models/models");
const ApiError = require("../error/ApiError");
const { Op } = require("sequelize");

class HospitalStaffController {
  // Отримати весь персонал з лікарнею
  async getAll(req, res, next) {
    try {
      const staff = await HospitalStaff.findAll({ include: Hospital });
      return res.json(staff);
    } catch (e) {
      console.error("getAll error:", e);
      return next(
        ApiError.internal("Не вдалося отримати список персоналу лікарні")
      );
    }
  }

  // Отримати всіх лікарів
  async getDoctors(req, res, next) {
    try {
      const doctors = await HospitalStaff.findAll({
        where: { position: "Doctor" },
        include: Hospital,
      });
      return res.json(doctors);
    } catch (e) {
      console.error("getDoctors error:", e);
      return next(ApiError.internal("Не вдалося отримати список лікарів"));
    }
  }

  // Отримати всіх non-doctor працівників
  async getMedicalStaff(req, res, next) {
    try {
      const staff = await HospitalStaff.findAll({
        where: { position: "Staff" },
        include: Hospital,
      });
      return res.json(staff);
    } catch (e) {
      console.error("getMedicalStaff error:", e);
      return next(ApiError.internal("Не вдалося отримати список медперсоналу"));
    }
  }

  // Отримати одного працівника
  async getById(req, res, next) {
    try {
      const item = await HospitalStaff.findByPk(req.params.id, {
        include: Hospital,
      });
      if (!item) return next(ApiError.notFound("Працівника не знайдено"));
      return res.json(item);
    } catch (e) {
      console.error("getById error:", e);
      return next(ApiError.internal("Помилка отримання працівника"));
    }
  }

  // Створити нового працівника (тільки Staff)
  async create(req, res, next) {
    try {
      const {
        user_id,
        hospital_id,
        first_name,
        last_name,
        middle_name,
        email,
        position = "Staff",
      } = req.body;

      const user = await User.findByPk(user_id);
      if (!user) return next(ApiError.badRequest("Користувача не знайдено"));

      const exists = await HospitalStaff.findOne({ where: { user_id } });
      if (exists)
        return next(ApiError.badRequest("Цей користувач вже є у персоналі"));

      if (user.role === "Doctor") {
        return next(ApiError.badRequest("Лікарі додаються автоматично"));
      }

      const created = await HospitalStaff.create({
        user_id,
        hospital_id,
        first_name,
        last_name,
        middle_name,
        email,
        position,
      });

      return res.json(created);
    } catch (e) {
      console.error("create error:", e);
      return next(ApiError.badRequest("Не вдалося створити працівника"));
    }
  }

  // Оновити працівника
  async update(req, res, next) {
    try {
      const item = await HospitalStaff.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Працівника не знайдено"));
      await item.update(req.body);
      return res.json(item);
    } catch (e) {
      console.error("update error:", e);
      return next(ApiError.internal("Помилка оновлення працівника"));
    }
  }

  // Видалити працівника
  async delete(req, res, next) {
    try {
      const item = await HospitalStaff.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Працівника не знайдено"));
      await item.destroy();
      return res.json({ message: "Працівника видалено" });
    } catch (e) {
      console.error("delete error:", e);
      return next(ApiError.internal("Помилка видалення працівника"));
    }
  }

  // Отримати по user_id
  async getByUserId(req, res, next) {
    try {
      const { userId } = req.params;

      const staff = await HospitalStaff.findOne({
        where: { user_id: userId },
        include: Hospital,
      });

      if (!staff) {
        return next(
          ApiError.notFound("Співробітника з таким user_id не знайдено")
        );
      }

      return res.json(staff);
    } catch (e) {
      console.error("getByUserId error:", e);
      return next(ApiError.internal("Помилка отримання співробітника"));
    }
  }

  // Отримати всіх non-doctor співробітників лікарні
  async getNonDoctorsByHospital(req, res, next) {
    try {
      const { hospitalId } = req.params;

      const nonDoctors = await HospitalStaff.findAll({
        where: {
          hospital_id: hospitalId,
          position: { [Op.ne]: "Doctor" },
        },
        include: Hospital,
      });

      return res.json(nonDoctors);
    } catch (e) {
      console.error("getNonDoctorsByHospital error:", e);
      return next(ApiError.internal("Не вдалося отримати non-doctor персонал"));
    }
  }
  async getUniquePositions(req, res, next) {
    try {
      const positions = await HospitalStaff.findAll({
        attributes: [
          [
            require("sequelize").fn(
              "DISTINCT",
              require("sequelize").col("position")
            ),
            "position",
          ],
        ],
        where: { position: { [Op.ne]: "Doctor" } },
      });

      return res.json(positions.map((p) => p.position));
    } catch (e) {
      console.error("getUniquePositions error:", e);
      return next(ApiError.internal("Не вдалося отримати список посад"));
    }
  }
}

module.exports = new HospitalStaffController();
