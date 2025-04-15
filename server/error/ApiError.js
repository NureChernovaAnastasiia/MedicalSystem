class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }

    // Метод для створення помилки "поганий запит" (404)
    static badRequest(message) {
        return new ApiError(404, message);
    }

    // Метод для створення внутрішньої помилки сервера (500)
    static internal(message) {
        return new ApiError(500, message);
    }

    // Метод для створення помилки "заборонено" (403)
    static forbidden(message) {
        return new ApiError(403, message);
    }
}

module.exports = ApiError;