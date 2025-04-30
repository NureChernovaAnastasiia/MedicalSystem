const ApiError = require("../error/ApiError");

class ReviewValidator {
  static validateCreate(body, next) {
    const { target_type, target_id, rating } = body;

    if (!target_type || !target_id || !rating) {
      return next(ApiError.badRequest("target_type, target_id та rating обов'язкові"));
    }

    if (!["Doctor", "Hospital"].includes(target_type)) {
      return next(ApiError.badRequest("target_type має бути 'Doctor' або 'Hospital'"));
    }

    if (rating < 1 || rating > 5) {
      return next(ApiError.badRequest("Рейтинг має бути між 1 і 5"));
    }
  }

  static validateGetByTarget(params, next) {
    const { target_type, target_id } = params;

    if (!target_type || !target_id) {
      return next(ApiError.badRequest("target_type та target_id обов'язкові"));
    }

    if (!["Doctor", "Hospital"].includes(target_type)) {
      return next(ApiError.badRequest("target_type має бути 'Doctor' або 'Hospital'"));
    }
  }
}

module.exports = ReviewValidator;