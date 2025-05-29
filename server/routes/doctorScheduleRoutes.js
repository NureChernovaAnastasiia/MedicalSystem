const Router = require("express");
const router = new Router();
const controller = require("../controllers/doctorScheduleController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.use(authMiddleware);

router.get("/working-hours/:doctorId/:date", controller.getWorkingHoursByDate);

router.get("/:id", authMiddleware, controller.getById);

// Публічний доступ до розкладу лікаря на день
router.get("/doctor/:doctorId/date/:date", controller.getByDoctorAndDate);

// Усі розклади (Admin)
router.get("/", checkRole("Admin"), controller.getAll);

// Розклад за лікарнею
router.get("/hospital/:hospitalId", controller.getByHospital);

// Розклад конкретного лікаря (лікар бачить тільки свій)
router.get("/doctor/:doctorId", controller.getByDoctor);

// Створити (Admin)
router.post("/", checkRole("Admin"), controller.create);

// Оновити (Admin)
router.put("/:id", checkRole("Admin"), controller.update);

// Видалити (Admin)
router.delete("/:id", checkRole("Admin"), controller.delete);

// 🔒 Бронювання конкретного слота по ID (пацієнт або лікар/адмін з patient_id)
router.post("/:scheduleId/book", controller.bookSchedule);

module.exports = router;
