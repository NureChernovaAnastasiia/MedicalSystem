const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/', analyticsController.getAll);
router.get('/:id', analyticsController.getById);
router.post('/', analyticsController.create);
router.put('/:id', analyticsController.update);
router.delete('/:id', analyticsController.delete);

module.exports = router;
