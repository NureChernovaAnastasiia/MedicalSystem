const express = require('express');
const router = express.Router();
const hospitalStaffController = require('../controllers/hospitalStaffController');

// STATIC routes first
router.get('/doctors', hospitalStaffController.getDoctors);
router.get('/medical-staff', hospitalStaffController.getMedicalStaff);

// DYNAMIC route after
router.get('/:id', hospitalStaffController.getById);
router.get('/', hospitalStaffController.getAll);
router.post('/', hospitalStaffController.create);
router.put('/:id', hospitalStaffController.update);
router.delete('/:id', hospitalStaffController.delete);

module.exports = router;
