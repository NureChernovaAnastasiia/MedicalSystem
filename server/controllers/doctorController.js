const { Doctor, Hospital, User } = require('../models/models');
const ApiError = require('../error/ApiError');

class DoctorController {
    async getAll(req, res, next) {
        try {
            const items = await Doctor.findAll({ include: Hospital });
            return res.json(items);
        } catch (e) {
            console.error('getAll error:', e);
            return next(ApiError.internal('Не вдалося отримати список лікарів'));
        }
    }

    async getById(req, res, next) {
        try {
            const item = await Doctor.findByPk(req.params.id, { include: Hospital });
            if (!item) return next(ApiError.notFound('Лікаря не знайдено'));
            return res.json(item);
        } catch (e) {
            console.error('getById error:', e);
            return next(ApiError.internal('Помилка отримання лікаря'));
        }
    }

    async create(req, res, next) {
        try {
          // 🔐 Перевірка прав доступу
          if (req.user.role !== 'Admin') {
            return next(ApiError.forbidden('Тільки адміністратор може створювати лікарів вручну'));
          }
      
          const { email, first_name, last_name, middle_name = '', hospital_id } = req.body;
      
          // 🔎 Знаходимо користувача за email
          const user = await User.findOne({ where: { email } });
          if (!user || user.role !== 'Doctor') {
            return next(ApiError.badRequest('Користувач з таким email не є лікарем або не існує'));
          }
      
          // 📛 Перевіряємо, чи лікар вже існує
          const existingDoctor = await Doctor.findOne({ where: { user_id: user.id } });
          if (existingDoctor) {
            return next(ApiError.badRequest('Цей лікар вже існує в базі'));
          }
      
          // ✅ Створюємо лікаря
          const doctor = await Doctor.create({
            user_id: user.id,
            hospital_id,
            first_name,
            last_name,
            middle_name,
            email,
          });
      
          return res.json(doctor);
        } catch (e) {
          console.error('❌ create doctor error:', e.message);
          return next(ApiError.internal('Не вдалося створити лікаря'));
        }
      }
      

    async update(req, res, next) {
        try {
            const item = await Doctor.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Лікаря не знайдено'));

            const { hospital_id } = req.body;
            if (hospital_id) {
                const hospitalExists = await Hospital.findByPk(hospital_id);
                if (!hospitalExists) {
                    return next(ApiError.badRequest('Вказана лікарня не знайдена'));
                }
            }

            await item.update(req.body);
            return res.json(item);
        } catch (e) {
            console.error('update error:', e);
            return next(ApiError.internal('Помилка оновлення лікаря'));
        }
    }

    async delete(req, res, next) {
        try {
            const item = await Doctor.findByPk(req.params.id);
            if (!item) return next(ApiError.notFound('Лікаря не знайдено'));

            await item.destroy();
            return res.json({ message: 'Лікаря видалено' });
        } catch (e) {
            console.error('delete error:', e);
            return next(ApiError.internal('Помилка видалення лікаря'));
        }
    }
    // Get all doctors by hospital ID
async getByHospital(req, res, next) {
    try {
      const { hospitalId } = req.params;
  
      const hospital = await Hospital.findByPk(hospitalId);
      if (!hospital) {
        return next(ApiError.notFound("Лікарню не знайдено"));
      }
  
      const doctors = await Doctor.findAll({
        where: { hospital_id: hospitalId },
        include: [Hospital],
      });
  
      return res.json(doctors);
    } catch (e) {
      console.error("getByHospital error:", e);
      return next(ApiError.internal("Помилка отримання лікарів по лікарні"));
    }
  }  
}

module.exports = new DoctorController();
