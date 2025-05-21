const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypalController');
const authMiddleware = require('../middleware/authMiddleware');

// 🔐 Усі PayPal маршрути потребують авторизації
router.use(authMiddleware);

// 📌 Створити замовлення
router.post('/create-order', paypalController.createOrder);

// 📌 Підтвердити замовлення
router.post('/capture-order', paypalController.captureOrder);

module.exports = router;