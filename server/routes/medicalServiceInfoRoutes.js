const router = require("express").Router();
const controller = require("../controllers/medicalServiceInfoController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.use(authMiddleware);
router.post("/", checkRole("Admin"), controller.create);
router.get("/", controller.getAll);

module.exports = router;