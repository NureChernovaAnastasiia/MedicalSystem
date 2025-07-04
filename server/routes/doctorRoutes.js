const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.use(authMiddleware);

router.put("/:id/photo", authMiddleware, doctorController.updatePhoto);
router.get("/specializations", doctorController.getUniqueSpecializations);
router.get(
  "/by-user/:userId",
  checkRole("Admin", "Doctor"),
  doctorController.getDoctorByUserId
);
router.get("/", authMiddleware, doctorController.getAll);
router.get("/:id", authMiddleware, doctorController.getById);

router.get("/by-hospital/:hospitalId", doctorController.getByHospital);

// ❗️тільки для Admin
router.post("/", authMiddleware, checkRole("Admin"), doctorController.create);
router.put("/:id", authMiddleware, checkRole("Admin"), doctorController.update);
router.delete(
  "/:id",
  authMiddleware,
  checkRole("Admin"),
  doctorController.delete
);

module.exports = router;
