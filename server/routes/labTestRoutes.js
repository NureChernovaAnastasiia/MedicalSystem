const express = require("express");
const router = express.Router();
const labTestController = require("../controllers/labTestController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/checkRoleMiddleware");

router.use(authMiddleware);

// Get lab tests by hospital ID (Admin, Doctor only)
router.get(
  "/by-hospital/:hospitalId",
  roleMiddleware("Admin", "Doctor"),
  labTestController.getByHospital
);
router.patch(
  "/mark-ready/:id",
  roleMiddleware("Admin", "Doctor"),
  labTestController.markReadyStatus
);
router.get("/doctor/:doctorId", labTestController.getByDoctor);

router.get("/", labTestController.getAll);
router.get("/:id", labTestController.getById);
router.get("/patient/:patientId", labTestController.getByPatient);
router.get("/status/filter", labTestController.getByPatientStatus);
router.post("/", labTestController.create);
router.put("/:id", labTestController.update);
router.delete("/:id", labTestController.delete);
router.get("/:id/pdf", labTestController.downloadPDF);

module.exports = router;
