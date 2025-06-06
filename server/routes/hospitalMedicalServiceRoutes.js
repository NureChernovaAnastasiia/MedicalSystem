const router = require("express").Router();
const hospitalMedicalServiceController = require("../controllers/hospitalMedicalServiceController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/checkRoleMiddleware");

router.use(authMiddleware);

router.get('/available/:hospitalId', hospitalMedicalServiceController.getAvailableForHospital);
router.get('/hospital/:hospitalId', hospitalMedicalServiceController.getByHospital);
router.get('/doctor/:doctorId', hospitalMedicalServiceController.getByDoctor);

// Отримання одного запису
router.get('/:id', hospitalMedicalServiceController.getById);

// Адмін-доступ
router.get('/', roleMiddleware('Admin', 'Doctor', 'Patient'), hospitalMedicalServiceController.getAll);
router.post('/', roleMiddleware('Admin', 'Doctor'), hospitalMedicalServiceController.create);
router.put('/:id', roleMiddleware('Admin', 'Doctor'), hospitalMedicalServiceController.update);
router.delete('/:id', roleMiddleware('Admin', 'Doctor'), hospitalMedicalServiceController.delete);

module.exports = router;
