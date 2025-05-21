const paypalService = require('../services/paypalService');

const createOrder = async (req, res, next) => {
  try {
    const { serviceType, amount } = req.body;
    if (!serviceType || !amount) {
      return res.status(400).json({ message: 'serviceType та amount обовʼязкові' });
    }
    const order = await paypalService.createOrder(serviceType, amount);
    res.status(201).json(order);
  } catch (error) {
    console.error('Помилка створення замовлення:', error);
    res.status(500).json({ message: 'Не вдалося створити замовлення' });
  }
};

const captureOrder = async (req, res, next) => {
  try {
    const { orderId, usedFor, hospitalId, userId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'orderId обовʼязковий' });
    }

    const result = await paypalService.captureOrder(
      orderId,
      usedFor,
      userId || req.user?.id,
      hospitalId || null
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Помилка підтвердження платежу:', error);
    res.status(500).json({ message: error.message || 'Не вдалося підтвердити платіж' });
  }
};

module.exports = {
  createOrder,
  captureOrder,
};
