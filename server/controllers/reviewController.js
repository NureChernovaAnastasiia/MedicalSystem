const { Review, Hospital, Doctor, Patient, User } = require("../models/models");
const ApiError = require("../error/ApiError");
const MailService = require("../utils/mailService");
const generateReviewEmail = require("../templates/reviewNotificationTemplate");
const ReviewValidator = require("../validations/reviewValidation");

const REVIEW_RECEIVER_EMAIL = "anastasiia.chernova@nure.ua";

class ReviewController {
  async getAll(req, res, next) {
    try {
      const reviews = await Review.findAll();
      return res.json(reviews);
    } catch (e) {
      console.error('❌ getAll Review error:', e);
      return next(ApiError.internal('Не вдалося отримати список відгуків'));
    }
  }

  async getById(req, res, next) {
    try {
      const review = await Review.findByPk(req.params.id);
      if (!review) return next(ApiError.notFound('Відгук не знайдено'));
      return res.json(review);
    } catch (e) {
      console.error('❌ getById Review error:', e);
      return next(ApiError.internal('Помилка отримання відгуку'));
    }
  }

  async create(req, res, next) {
    try {
      // Перевірка авторизації
      if (!req.user || !req.user.id) {
        return next(ApiError.unauthorized("Користувач не авторизований"));
      }
  
      const userId = req.user.id;
      const { target_type, target_id, rating, comment } = req.body;
  
      // Валідація вхідних даних
      ReviewValidator.validateCreate(req.body, next);
  
      // Перевірка чи це пацієнт
      const patient = await Patient.findOne({ where: { user_id: userId } });
      if (!patient) {
        return next(ApiError.forbidden("Тільки пацієнт може залишати відгуки"));
      }
  
      // Створення відгуку
      const review = await Review.create({
        user_id: userId,
        target_type,
        target_id,
        rating,
        comment,
      });
  
      // Отримуємо ім’я пацієнта
      const user = await User.findByPk(userId);
      if (!user) {
        return next(ApiError.internal("Користувача не знайдено"));
      }
  
      const patientName = user.username || user.email;
      let targetName = "";
  
      if (target_type === "Hospital") {
        const hospital = await Hospital.findByPk(target_id);
        if (!hospital) return next(ApiError.notFound("Лікарню не знайдено"));
        targetName = hospital.name;
      } else if (target_type === "Doctor") {
        const doctor = await Doctor.findByPk(target_id);
        if (!doctor) return next(ApiError.notFound("Лікаря не знайдено"));
        targetName = `${doctor.first_name} ${doctor.last_name}`;
      }
  
      // Відправка листа через шаблон
      await MailService.sendReviewNotification(REVIEW_RECEIVER_EMAIL, {
        patientName,
        targetType: target_type,
        targetName,
        rating,
        comment,
      });
  
      return res.json(review);
    } catch (e) {
      console.error("❌ create Review error:", e);
      return next(ApiError.internal("Не вдалося створити відгук"));
    }
  }

  async getByTarget(req, res, next) {
    try {
      const { target_type, target_id } = req.params;

      if (!target_type || !target_id) {
        return next(ApiError.badRequest("target_type і target_id обов'язкові"));
      }

      const reviews = await Review.findAll({
        where: { target_type, target_id },
      });

      return res.json(reviews);
    } catch (e) {
      console.error('❌ getByTarget Review error:', e);
      return next(ApiError.internal('Не вдалося отримати відгуки'));
    }
  }

  async update(req, res, next) {
    try {
      const review = await Review.findByPk(req.params.id);
      if (!review) return next(ApiError.notFound('Відгук не знайдено'));

      await review.update(req.body);
      return res.json(review);
    } catch (e) {
      console.error('❌ update Review error:', e);
      return next(ApiError.internal('Помилка оновлення відгуку'));
    }
  }

  async delete(req, res, next) {
    try {
      const review = await Review.findByPk(req.params.id);
      if (!review) return next(ApiError.notFound('Відгук не знайдено'));

      await review.destroy();
      return res.json({ message: 'Відгук видалено' });
    } catch (e) {
      console.error('❌ delete Review error:', e);
      return next(ApiError.internal('Помилка видалення відгуку'));
    }
  }
}

module.exports = new ReviewController();
