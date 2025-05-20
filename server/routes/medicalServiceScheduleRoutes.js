const router = require("express").Router();
const medicalServiceScheduleController = require("../controllers/medicalServiceScheduleController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require('../middleware/checkRoleMiddleware');

router.use(authMiddleware);

router.post('/book', medicalServiceScheduleController.bookMedicalService);

// 🆕 Розклад по medicalServiceId та даті
router.get(
  '/service/:medicalServiceId/date/:date',
  roleMiddleware('Admin', 'Doctor', 'Patient'),
  medicalServiceScheduleController.getByServiceAndDate
);
router.get('/working-hours/medical/:hospital_medical_service_id/:date', medicalServiceScheduleController.getWorkingHoursByDate);

router.get('/', roleMiddleware('Admin', 'Doctor', 'Patient'), medicalServiceScheduleController.getAll);
router.get('/:id', roleMiddleware('Admin', 'Doctor', 'Patient'), medicalServiceScheduleController.getById);
router.post('/', roleMiddleware('Admin', 'Doctor'), medicalServiceScheduleController.create);
router.put('/:id', roleMiddleware('Admin', 'Doctor'), medicalServiceScheduleController.update);
router.delete('/:id', roleMiddleware('Admin', 'Doctor'), medicalServiceScheduleController.delete);

module.exports = router;
