const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const patientRoutes = require("./patientRoutes");
const doctorRoutes = require("./doctorRoutes");
const hospitalRoutes = require("./hospitalRoutes");
const hospitalStaffRoutes = require("./hospitalStaffRoutes");
const doctorScheduleRoutes = require("./doctorScheduleRoutes");
const appointmentRoutes = require("./appointmentRoutes");
const medicalRecordRoutes = require("./medicalRecordRoutes");
const prescriptionRoutes = require("./prescriptionRoutes");
const labTestInfoRoutes = require("./labTestInfoRoutes");
const labTestRoutes = require("./labTestRoutes");
const labTestScheduleRoutes = require("./labTestScheduleRoutes");
const hospitalLabServiceRoutes = require("./hospitalLabServiceRoutes");
const financialReportRoutes = require("./financialReportRoutes");
const analyticsRoutes = require("./analyticsRoutes");
const reviewRoutes = require("./reviewRoutes");

router.use("/users", userRoutes);
router.use("/patients", patientRoutes);
router.use("/doctors", doctorRoutes);
router.use("/hospitals", hospitalRoutes);
router.use("/hospital-staff", hospitalStaffRoutes);
router.use("/doctor-schedules", doctorScheduleRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/medical-records", medicalRecordRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/lab-test-info", labTestInfoRoutes);
router.use("/lab-tests", labTestRoutes);
router.use("/lab-test-schedules", labTestScheduleRoutes);
router.use("/hospital-lab-services", hospitalLabServiceRoutes);
router.use("/financial-reports", financialReportRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/reviews", reviewRoutes);

module.exports = router;