const Router = require('express');
const router = new Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

// 🔐 Усі маршрути потребують авторизації
router.use(authMiddleware);

/**
 * @route   GET /api/appointments/upcoming/patient/:patientId
 * @desc    Отримати майбутні прийоми пацієнта
 *          (пацієнт — лише свої, лікар/адмін — будь-які)
 */
router.get('/upcoming/patient/:patientId', appointmentController.getUpcomingByPatient);

/**
 * @route   GET /api/appointments
 * @desc    Отримати всі прийоми (лише Admin)
 */
router.get('/', checkRole('Admin'), appointmentController.getAll);

/**
 * @route   GET /api/appointments/:id
 * @desc    Отримати прийом по ID (пацієнт — лише свій)
 */
router.get('/:id', appointmentController.getById);

/**
 * @route   POST /api/appointments
 * @desc    Створити новий прийом (Doctor або Patient)
 */
router.post('/', appointmentController.create);

/**
 * @route   PUT /api/appointments/:id
 * @desc    Оновити прийом (Doctor або Admin)
 */
router.put('/:id', checkRole(['Doctor', 'Admin']), appointmentController.update);

/**
 * @route   PATCH /api/appointments/:id/cancel
 * @desc    Скасувати прийом (Patient — свій, Admin — будь-який)
 */
router.patch('/:id/cancel', appointmentController.cancel);

/**
 * @route   GET /api/appointments/patient/:patientId
 * @desc    Отримати всі прийоми пацієнта (Patient — свої, Doctor/Admin — будь-які)
 */
router.get('/patient/:patientId', appointmentController.getByPatient);

/**
 * @route   GET /api/appointments/doctor/:doctorId
 * @desc    Отримати всі прийоми лікаря (Doctor — свої, Admin — будь-які)
 */
router.get('/doctor/:doctorId', appointmentController.getByDoctor);

module.exports = router;
