const Router = require('express');
const router = new Router();
const hospitalLabServiceController = require('../controllers/hospitalLabServiceController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/available/:hospitalId', hospitalLabServiceController.getAvailableForHospital);
router.get('/', hospitalLabServiceController.getAll);
router.get('/:id', hospitalLabServiceController.getById);
router.get('/hospital/:hospitalId', hospitalLabServiceController.getByHospital);

router.post('/', authMiddleware, hospitalLabServiceController.create);
router.put('/:id', authMiddleware, hospitalLabServiceController.update);
router.delete('/:id', authMiddleware, hospitalLabServiceController.delete);

module.exports = router;
