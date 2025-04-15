const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');

router.get('/', medicalRecordController.getAll);
router.get('/:id', medicalRecordController.getById);
router.post('/', medicalRecordController.create);
router.put('/:id', medicalRecordController.update);
router.delete('/:id', medicalRecordController.delete);

module.exports = router;
