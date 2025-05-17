const Router = require('express');
const router = new Router();
const labTestInfoController = require('../controllers/labTestInfoController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

// 🔓 Public routes
router.get('/', labTestInfoController.getAll);
router.get('/:id', labTestInfoController.getById);
router.get('/hospital/:hospitalId', labTestInfoController.getByHospital);

// 🔐 Admin routes
router.post('/', authMiddleware, checkRoleMiddleware('Admin'), labTestInfoController.create);
router.put('/:id', authMiddleware, checkRoleMiddleware('Admin'), labTestInfoController.update);
router.delete('/:id', authMiddleware, checkRoleMiddleware('Admin'), labTestInfoController.delete);

module.exports = router;
