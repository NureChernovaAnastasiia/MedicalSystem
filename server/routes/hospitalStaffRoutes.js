const express = require("express");
const router = express.Router();
const hospitalStaffController = require("../controllers/hospitalStaffController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

// 🔐 Усі маршрути вимагають авторизації
router.use(authMiddleware);

router.get("/positions/unique", hospitalStaffController.getUniquePositions);
router.get("/by-user/:userId", hospitalStaffController.getByUserId);
router.get(
  "/non-doctors/:hospitalId",
  hospitalStaffController.getNonDoctorsByHospital
);
router.get("/doctors", hospitalStaffController.getDoctors);
router.get("/medical-staff", hospitalStaffController.getMedicalStaff);
router.get("/:id", hospitalStaffController.getById);
router.get("/", hospitalStaffController.getAll);

// 🔒 Тільки для Admin
router.post("/", checkRoleMiddleware("Admin"), hospitalStaffController.create);
router.put(
  "/:id",
  checkRoleMiddleware("Admin"),
  hospitalStaffController.update
);
router.delete(
  "/:id",
  checkRoleMiddleware("Admin"),
  hospitalStaffController.delete
);

module.exports = router;
