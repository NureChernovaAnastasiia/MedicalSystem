const Router = require('express');
const router = new Router();
const controller = require('../controllers/doctorScheduleController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.use(authMiddleware);
// Публічний доступ до розкладу лікаря на день
router.get('/doctor/:doctorId/date/:date', controller.getByDoctorAndDate);

// Усі розклади (Admin)
router.get('/', checkRole('Admin'), controller.getAll);

// Розклад за лікарнею
router.get('/hospital/:hospitalId', controller.getByHospital);

// Розклад конкретного лікаря (лікар бачить тільки свій)
router.get('/doctor/:doctorId', controller.getByDoctor);

// Створити (Admin)
router.post('/', checkRole('Admin'), controller.create);

// Оновити (Admin)
router.put('/:id', checkRole('Admin'), controller.update);

// Видалити (Admin)
router.delete('/:id', checkRole('Admin'), controller.delete);



module.exports = router;
