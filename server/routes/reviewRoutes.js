const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const reviewValidationMiddleware = require('../middleware/reviewValidationMiddleware');

// Без авторизації
router.get('/target/:target_type/:target_id', reviewController.getByTarget);
router.get('/', reviewController.getAll);
router.get('/:id', reviewController.getById);

// Захищені маршрути
router.post('/', authMiddleware, reviewValidationMiddleware, reviewController.create);
router.put('/:id', authMiddleware, reviewController.update);
router.delete('/:id', authMiddleware, reviewController.delete);

module.exports = router;
