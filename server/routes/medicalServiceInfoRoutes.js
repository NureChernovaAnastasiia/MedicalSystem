const express = require('express');
const router = express.Router();
const controller = require('../controllers/medicalServiceInfoController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/checkRoleMiddleware');

router.use(authMiddleware);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/hospital/:hospitalId', controller.getByHospital);
router.post('/', roleMiddleware('Admin'), controller.create);
router.put('/:id', roleMiddleware('Admin'), controller.update);
router.delete('/:id', roleMiddleware('Admin'), controller.delete);

module.exports = router;
