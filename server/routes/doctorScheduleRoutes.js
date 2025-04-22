const Router = require('express');
const router = new Router();
const controller = require('../controllers/doctorScheduleController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.use(authMiddleware);

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
