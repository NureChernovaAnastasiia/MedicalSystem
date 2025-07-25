const express = require("express");
const router = express.Router();
const medicalServiceController = require("../controllers/medicalServiceController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/checkRoleMiddleware");

router.use(authMiddleware);

router.get(
  "/by-doctor/:doctorId",
  roleMiddleware("Admin", "Doctor"),
  medicalServiceController.getByDoctor
);
router.get(
  "/hospital/:hospitalId",
  roleMiddleware("Admin", "Doctor"),
  medicalServiceController.getByHospital
);
router.patch(
  "/mark-ready/:id",
  roleMiddleware("Admin", "Doctor"),
  medicalServiceController.markReadyStatus
);
router.get(
  "/:id/pdf",
  roleMiddleware("Admin", "Doctor", "Patient"),
  medicalServiceController.downloadPDF
);
router.get("/patient/:patientId", medicalServiceController.getByPatient);
router.get("/:id", medicalServiceController.getById);
router.get(
  "/",
  roleMiddleware("Admin", "Doctor"),
  medicalServiceController.getAll
);
router.post(
  "/",
  roleMiddleware("Admin", "Doctor"),
  medicalServiceController.create
);
router.put(
  "/:id",
  roleMiddleware("Admin", "Doctor"),
  medicalServiceController.update
);
router.delete("/:id", roleMiddleware("Admin"), medicalServiceController.delete);

module.exports = router;
