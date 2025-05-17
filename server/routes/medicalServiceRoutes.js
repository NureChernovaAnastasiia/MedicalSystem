const express = require("express");
const router = express.Router();

const medicalServiceController = require("../controllers/medicalServiceController"); // ✅ Ім'я відповідає файлу

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/checkRoleMiddleware");

router.use(authMiddleware);

router.get('/:id/pdf', roleMiddleware('Admin', 'Doctor', 'Patient'), medicalServiceController.downloadPDF);
router.get('/patient/:patientId', medicalServiceController.getByPatient);
router.get('/:id', medicalServiceController.getById);
router.get('/', roleMiddleware('Admin', 'Doctor'), medicalServiceController.getAll);
router.post('/', roleMiddleware('Admin', 'Doctor'), medicalServiceController.create);
router.put('/:id', roleMiddleware('Admin', 'Doctor'), medicalServiceController.update);
router.delete('/:id', roleMiddleware('Admin'), medicalServiceController.delete);

module.exports = router;
