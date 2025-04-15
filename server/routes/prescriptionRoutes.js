const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');

router.get('/', prescriptionController.getAll);
router.get('/:id', prescriptionController.getById);
router.post('/', prescriptionController.create);
router.put('/:id', prescriptionController.update);
router.delete('/:id', prescriptionController.delete);

module.exports = router;
