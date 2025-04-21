class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

    // 🔁 400 Bad Request — Невірні або неповні дані
    static badRequest(message = "Bad Request") {
        return new ApiError(400, message);
    }

    // 🔒 401 Unauthorized — Неавторизований
    static unauthorized(message = "Unauthorized") {
        return new ApiError(401, message);
    }

    // 🚫 403 Forbidden — Немає прав
    static forbidden(message = "Forbidden") {
        return new ApiError(403, message);
    }

    // ❌ 404 Not Found — Ресурс не знайдено
    static notFound(message = "Not Found") {
        return new ApiError(404, message);
    }

    // ⚠️ 409 Conflict — Конфлікт (наприклад, дублікат email)
    static conflict(message = "Conflict") {
        return new ApiError(409, message);
    }

    // 💥 500 Internal Server Error — Внутрішня помилка
    static internal(message = "Internal Server Error") {
        return new ApiError(500, message);
    }
}

module.exports = ApiError;
