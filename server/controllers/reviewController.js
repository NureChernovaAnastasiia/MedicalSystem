const { Review, Hospital, Doctor, Patient, User } = require("../models/models");
const ApiError = require("../error/ApiError");
const MailService = require("../utils/mailService");
const generateReviewEmail = require("../templates/reviewNotificationTemplate");
const ReviewValidator = require("../validations/reviewValidation");
const { Op } = require('sequelize');

const REVIEW_RECEIVER_EMAIL = "anastasiia.chernova@nure.ua";

class ReviewController {
  async getAll(req, res, next) {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: Patient,
          attributes: ['first_name', 'last_name', 'birth_date', 'photo_url'],
        },
      ],
    });

    const reviewsWithAge = reviews.map(r => {
      const birthDate = new Date(r.Patient?.birth_date);
      const age = birthDate ? new Date().getFullYear() - birthDate.getFullYear() : null;

      return {
        ...r.toJSON(),
        reviewer: {
          name: `${r.Patient?.first_name || ''} ${r.Patient?.last_name || ''}`.trim(),
          age,
          photo_url: r.Patient?.photo_url || null,
        },
      };
    });

    return res.json(reviewsWithAge);
  } catch (e) {
    console.error('getAllReviews error:', e);
    return next(ApiError.internal('Не вдалося отримати відгуки'));
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
    if (!req.user?.id) {
      return next(ApiError.unauthorized("Користувач не авторизований"));
    }

    const userId = req.user.id;
    const { target_type, target_id, rating, comment } = req.body;

    ReviewValidator.validateCreate(req.body, next);

    const patient = await Patient.findOne({ where: { user_id: userId } });
    if (!patient) {
      return next(ApiError.forbidden("Тільки пацієнт може залишати відгуки"));
    }

    const review = await Review.create({
      user_id: userId,
      target_type,
      target_id,
      rating,
      comment,
    });

    const user = await User.findByPk(userId);
    if (!user) {
      return next(ApiError.internal("Користувача не знайдено"));
    }

    const patientName = `${patient.first_name || ""} ${patient.last_name || ""}`.trim();
    const patientPhoto = patient.photo_url || null;
    const patientEmail = user.email || "невідомо";

    let patientAge = null;
    if (patient.birth_date) {
      const birthDate = new Date(patient.birth_date);
      const today = new Date();
      patientAge = today.getFullYear() - birthDate.getFullYear();
    }

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

    // Відправка email з усіма даними
    await MailService.sendReviewNotification(REVIEW_RECEIVER_EMAIL, {
      patientName,
      patientEmail,
      patientAge,
      patientPhoto,
      targetType: target_type,
      targetName,
      rating,
      comment,
      createdAt: review.createdAt,
      reviewId: review.id,
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
