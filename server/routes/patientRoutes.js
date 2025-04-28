const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.use(authMiddleware);

// Get all patients (Admin, Doctor)
router.get('/', checkRole('Admin', 'Doctor'), patientController.getAll);

// Get one patient (Patient can view only self)
router.get('/:id', patientController.getById);

// Отримати пацієнта за user_id
router.get('/by-user/:userId', checkRole('Admin', 'Doctor', 'Patient'), patientController.getByUserId);

// Create patient (Doctor or Admin)
router.post('/', checkRole('Doctor', 'Admin'), patientController.create);

// Update patient (Doctor, Admin, or Patient)
router.put('/:id', checkRole('Doctor', 'Admin', 'Patient'), patientController.update);

// Delete patient (Doctor, Admin)
router.delete('/:id', checkRole('Doctor', 'Admin'), patientController.delete);

// Отримати всіх пацієнтів конкретного лікаря (Doctor, Admin)
router.get("/by-doctor/:doctorId", checkRole("Doctor", "Admin"), patientController.getByDoctor);

module.exports = router;
