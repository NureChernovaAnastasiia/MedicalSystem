const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');


router.get('/unique-names', hospitalController.getUniqueNames);

// Публічні (усі можуть переглядати)
router.get('/', hospitalController.getAll);
router.get('/:id', hospitalController.getById);

// 🔐 Тільки Admin може створювати, оновлювати, видаляти
router.post('/', authMiddleware, checkRole('Admin'), hospitalController.create);
router.put('/:id', authMiddleware, checkRole('Admin'), hospitalController.update);
router.delete('/:id', authMiddleware, checkRole('Admin'), hospitalController.delete);

module.exports = router;
