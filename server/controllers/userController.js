const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');
const ApiError = require('../error/ApiError');

// Генерація JWT токена
const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

class UserController {
    async registration(req, res, next) {
        try {
            const { email, password, role } = req.body;

            if (!email || !password) {
                return next(ApiError.badRequest('Некоректний email або пароль'));
            }

            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return next(ApiError.badRequest('Користувач з таким email вже існує'));
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ email, password: hashPassword, role });

            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });
        } catch (e) {
            console.error('registration error:', e);
            return next(ApiError.internal('Помилка реєстрації'));
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return next(ApiError.internal('Користувача не знайдено'));
            }

            const comparePassword = await bcrypt.compare(password, user.password);
            if (!comparePassword) {
                return next(ApiError.internal('Вказано невірний пароль'));
            }

            const token = generateJwt(user.id, user.email, user.role);
            return res.json({ token });
        } catch (e) {
            console.error('login error:', e);
            return next(ApiError.internal('Помилка входу'));
        }
    }

    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            if (!user) {
                return next(ApiError.badRequest('Користувача не знайдено'));
            }
            return res.json(user);
        } catch (e) {
            console.error('getUserById error:', e);
            return next(ApiError.internal('Помилка отримання даних користувача'));
        }
    }

    async check(req, res, next) {
        try {
            const token = generateJwt(req.user.id, req.user.email, req.user.role);
            return res.json({ token, role: req.user.role });
        } catch (e) {
            console.error('check error:', e);
            return next(ApiError.internal('Помилка перевірки токена'));
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { email, password, role } = req.body;

            const user = await User.findByPk(id);
            if (!user) {
                return next(ApiError.badRequest('Користувача не знайдено'));
            }

            user.email = email || user.email;
            if (password) {
                user.password = await bcrypt.hash(password, 5);
            }
            user.role = role || user.role;
            await user.save();

            return res.json(user);
        } catch (e) {
            console.error('update error:', e);
            return next(ApiError.internal('Помилка оновлення'));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            if (!user) {
                return next(ApiError.badRequest('Користувача не знайдено'));
            }

            await user.destroy();
            return res.json({ message: 'Користувача видалено' });
        } catch (e) {
            console.error('delete error:', e);
            return next(ApiError.internal('Помилка видалення'));
        }
    }
}

module.exports = new UserController();
