const Router = require('express');
const router = new Router();
const labTestInfoController = require('../controllers/labTestInfoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', labTestInfoController.getAll); // 🔓 Public
router.get('/:id', labTestInfoController.getById); // 🔓 Public
router.get('/hospital/:hospitalId', labTestInfoController.getByHospital); // 🔓 Public

router.post('/', authMiddleware, labTestInfoController.create); // 🔐 Admin
router.put('/:id', authMiddleware, labTestInfoController.update); // 🔐 Admin
router.delete('/:id', authMiddleware, labTestInfoController.delete); // 🔐 Admin

module.exports = router;
