const express = require('express');
const router = express.Router();
const labTestController = require('../controllers/labTestController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', labTestController.getAll);
router.get('/:id', labTestController.getById);
router.get('/patient/:patientId', labTestController.getByPatient);
router.get('/status/filter', labTestController.getByPatientStatus);
router.post('/', labTestController.create);
router.put('/:id', labTestController.update);
router.delete('/:id', labTestController.delete);
router.get('/:id/pdf', labTestController.downloadPDF);

module.exports = router;
