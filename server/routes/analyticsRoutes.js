const Router = require('express');
const router = new Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

// 🔐 Всі запити тільки для авторизованих адміністраторів
router.use(authMiddleware);
router.use(checkRole('Admin'));

/**
 * @route   GET /api/analytics/top-doctors?hospitalId=1
 */
router.get('/top-doctors', analyticsController.topDoctors);

/**
 * @route   GET /api/analytics/weekly-visits?hospitalId=1
 */
router.get('/weekly-visits', analyticsController.weeklyAppointments);

/**
 * @route   GET /api/analytics/monthly-income?hospitalId=1
 */
router.get('/monthly-income', analyticsController.monthlyIncome);

/**
 * @route   GET /api/analytics/average-doctor-rating?hospitalId=1
 */
router.get('/average-doctor-rating', analyticsController.averageDoctorRating);

/**
 * @route   GET /api/analytics/most-active-patients?hospitalId=1
 */
router.get('/most-active-patients', analyticsController.mostActivePatients);

/**
 * @route   GET /api/analytics/most-requested-lab-tests?hospitalId=1
 */
router.get('/most-requested-lab-tests', analyticsController.mostRequestedLabTests);

/**
 * @route   GET /api/analytics/most-used-medical-services?hospitalId=1
 */
router.get('/most-used-medical-services', analyticsController.mostUsedMedicalServices);

module.exports = router;
