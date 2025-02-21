const Router = require('express')
const router = new Router()

const userRoutes = require('./routes/userRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const hospitalStaffRoutes = require('./routes/hospitalStaffRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const labTestRoutes = require('./routes/labTestRoutes');
const financialReportRoutes = require('./routes/financialReportRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

router.use('/users', userRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/hospital-staff', hospitalStaffRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/medical-records', medicalRecordRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/lab-tests', labTestRoutes);
router.use('/financial-reports', financialReportRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router