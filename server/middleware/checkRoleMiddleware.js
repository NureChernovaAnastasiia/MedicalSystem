const jwt = require('jsonwebtoken');

module.exports = function (requiredRole) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") return next();

        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: "Користувач не авторизований" });
            }

            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Користувач не авторизований" });
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;

            if (decoded.role !== requiredRole) {
                return res.status(403).json({ message: "Немає доступу" });
            }

            next();
        } catch (e) {
            console.error('checkRoleMiddleware error:', e);
            return res.status(401).json({ message: "Користувач не авторизований" });
        }
    };
};
