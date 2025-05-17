const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/checkRoleMiddleware');

router.use(authMiddleware);

router.get(
  "/:recordId/patient/:patientId/prescriptions",
  roleMiddleware("Admin", "Doctor", "Patient"),
  medicalRecordController.getPrescriptionsByRecordAndPatient
);

router.get(
  "/patient/:patientId",
  roleMiddleware("Admin", "Doctor", "Patient"),
  medicalRecordController.getRecordsByPatient
);

router.get('/', medicalRecordController.getAll);
router.get('/:id', medicalRecordController.getById);
router.post('/', medicalRecordController.create);
router.put('/:id', medicalRecordController.update);
router.delete('/:id', medicalRecordController.delete);

module.exports = router;
