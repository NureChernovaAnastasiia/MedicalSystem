const router = require("express").Router();
const controller = require("../controllers/medicalServiceScheduleController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.use(authMiddleware);
router.post("/", checkRole("Doctor", "Admin"), controller.create);
router.get("/:hospital_medical_service_id", controller.getByHospitalService);

module.exports = router;