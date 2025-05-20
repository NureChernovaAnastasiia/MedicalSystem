const express = require('express');
const router = express.Router();
const labTestScheduleController = require('../controllers/labTestScheduleController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/checkRoleMiddleware');

router.use(authMiddleware);

router.post('/book', labTestScheduleController.bookLabTest); 

// 🆕 Розклад по medicalServiceId та даті
router.get(
  '/lab/:labServiceId/date/:date',
  roleMiddleware('Admin', 'Doctor', 'Patient'),
  labTestScheduleController.getByLabAndDate
);
router.get('/working-hours/lab/:hospital_lab_service_id/:date', labTestScheduleController.getWorkingHoursByDate);

router.get('/', roleMiddleware('Admin', 'Doctor', 'Patient'), labTestScheduleController.getAll);
router.get('/:id', roleMiddleware('Admin', 'Doctor', 'Patient'), labTestScheduleController.getById);
router.post('/', roleMiddleware('Admin', 'Doctor'), labTestScheduleController.create);
router.put('/:id', roleMiddleware('Admin', 'Doctor'), labTestScheduleController.update);
router.delete('/:id', roleMiddleware('Admin', 'Doctor'), labTestScheduleController.delete);

module.exports = router;
