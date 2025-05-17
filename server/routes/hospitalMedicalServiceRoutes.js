const router = require("express").Router();
const hospitalMedicalServiceController = require("../controllers/hospitalMedicalServiceController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/checkRoleMiddleware");

router.use(authMiddleware);

// Специфічні маршрути — спочатку
router.get('/hospital/:hospitalId', hospitalMedicalServiceController.getByHospital);
router.get('/doctor/:doctorId', hospitalMedicalServiceController.getByDoctor);

// Отримання одного запису
router.get('/:id', hospitalMedicalServiceController.getById);

// Адмін-доступ
router.get('/', roleMiddleware('Admin'), hospitalMedicalServiceController.getAll);
router.post('/', roleMiddleware('Admin'), hospitalMedicalServiceController.create);
router.put('/:id', roleMiddleware('Admin'), hospitalMedicalServiceController.update);
router.delete('/:id', roleMiddleware('Admin'), hospitalMedicalServiceController.delete);

module.exports = router;
