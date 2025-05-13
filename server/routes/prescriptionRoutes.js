const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/:id/pdf', authMiddleware, prescriptionController.downloadPdf);
router.get('/patient/:patientId/:id', authMiddleware, prescriptionController.getByPatientAndId);
router.get('/patient/:patientId', prescriptionController.getByPatient);
router.get('/', prescriptionController.getAll);
router.get('/:id', prescriptionController.getById);
router.post('/', prescriptionController.create);
router.put('/:id', prescriptionController.update);
router.delete('/:id', prescriptionController.delete);

module.exports = router;
