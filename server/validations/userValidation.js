const { body } = require('express-validator');

const registerValidation = [
  body('email')
    .notEmpty().withMessage('Email не може бути порожнім')
    .isEmail().withMessage('Некоректний формат email')
    .isLength({ min: 5, max: 255 }).withMessage('Email повинен бути від 5 до 255 символів')
    .matches(/\.(com|ua|org)$/i).withMessage('Email повинен закінчуватись на .com, .ua або .org')
    .custom(value => {
      if (/\s/.test(value)) {
        throw new Error('Email не може містити пробіли');
      }
      return true;
    }),

  body('password')
    .notEmpty().withMessage('Пароль не може бути порожнім')
    .isLength({ min: 6, max: 100 }).withMessage('Пароль має бути від 6 до 100 символів')
    .matches(/[A-Z]/).withMessage('Пароль має містити хоча б одну велику літеру')
    .matches(/[a-z]/).withMessage('Пароль має містити хоча б одну маленьку літеру')
    .matches(/\d/).withMessage('Пароль має містити хоча б одну цифру'),

  body('username')
    .notEmpty().withMessage('Імʼя користувача не може бути порожнім')
    .isLength({ min: 2, max: 50 }).withMessage('Імʼя користувача повинно бути від 2 до 50 символів'),

  body('role')
    .notEmpty().withMessage('Роль не може бути порожньою')
    .isIn(['Patient', 'Doctor', 'Admin']).withMessage('Недопустима роль користувача'),

  // hospital_id — обовʼязковий тільки якщо роль Doctor або Admin
  body('hospital_id')
    .if(body('role').custom(role => role === 'Doctor' || role === 'Admin'))
    .notEmpty().withMessage('Для ролі Doctor або Admin потрібно вказати hospital_id')
    .isInt({ min: 1 }).withMessage('hospital_id має бути цілим числом'),

  // doctor_id — обовʼязковий тільки для Patient
  body('doctor_id')
    .if(body('role').equals('Patient'))
    .notEmpty().withMessage('Для пацієнта потрібно вказати doctor_id')
    .isInt({ min: 1 }).withMessage('doctor_id має бути цілим числом'),
];

module.exports = { registerValidation };
