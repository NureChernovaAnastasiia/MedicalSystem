const router = require("express").Router();
const controller = require("../controllers/medicalServiceController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.use(authMiddleware);
router.post("/", checkRole("Patient", "Admin", "Doctor"), controller.book);
router.get("/", checkRole("Doctor", "Admin"), controller.getAll);

module.exports = router;