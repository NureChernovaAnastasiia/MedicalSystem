const Router = require('express');
const router = new Router();
const controller = require('../controllers/hospitalLabServiceController');
const authMiddleware = require('../middleware/authMiddleware');

// 🔓 Публічні маршрути (всі можуть дивитися)
router.get('/', controller.getAll); // Усі послуги
router.get('/:id', controller.getById); // Послуга за ID
router.get('/hospital/:hospitalId', controller.getByHospital); // Послуги в лікарні

// 🔐 Захищені маршрути (Admin / Doctor)
router.post('/', authMiddleware, controller.create);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.delete);

module.exports = router;
