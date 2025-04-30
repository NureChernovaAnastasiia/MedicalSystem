const router = require("express").Router();
const controller = require("../controllers/hospitalMedicalServiceController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.use(authMiddleware);
router.post("/", checkRole("Admin"), controller.assign);
router.get("/", controller.getAll);

module.exports = router;