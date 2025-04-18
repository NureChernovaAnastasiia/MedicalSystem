const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/', authMiddleware, doctorController.getAll);
router.get('/:id', authMiddleware, doctorController.getById);

// ❗️тільки для Admin
router.post('/', authMiddleware, checkRole('Admin'), doctorController.create);
router.put('/:id', authMiddleware, checkRole('Admin'), doctorController.update);
router.delete('/:id', authMiddleware, checkRole('Admin'), doctorController.delete);

module.exports = router;
