const router = require("express").Router();
const hospitalMedicalServiceController = require("../controllers/hospitalMedicalServiceController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get('/hospital-medical-services', hospitalMedicalServiceController.getAll);
router.get('/hospital-medical-services/hospital/:hospitalId', hospitalMedicalServiceController.getByHospital);
router.get('/hospital-medical-services/doctor/:doctorId', hospitalMedicalServiceController.getByDoctor);
router.post('/hospital-medical-services', hospitalMedicalServiceController.create);
router.put('/hospital-medical-services/:id', hospitalMedicalServiceController.update);
router.delete('/hospital-medical-services/:id', hospitalMedicalServiceController.delete);

module.exports = router;
