const sequelize = require("../db");
const { DataTypes } = require("sequelize");

// User
const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true },
  role: {
    type: DataTypes.ENUM("Patient", "Doctor", "Admin"),
    allowNull: false,
  },
});

// Hospital
const Hospital = sequelize.define("Hospital", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.TEXT },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
});

// Hospital Staff
const HospitalStaff = sequelize.define("HospitalStaff", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hospital_id: { type: DataTypes.INTEGER, allowNull: false },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  middle_name: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  user_id: { type: DataTypes.INTEGER, unique: true },
});

// Patient
const Patient = sequelize.define("Patient", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hospital_id: { type: DataTypes.INTEGER, allowNull: false },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  middle_name: { type: DataTypes.STRING, allowNull: false },
  birth_date: { type: DataTypes.DATEONLY },
  gender: { type: DataTypes.ENUM("Male", "Female", "Other") },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  address: { type: DataTypes.TEXT },
  photo_url: { type: DataTypes.STRING },
  blood_type: { type: DataTypes.STRING },
  chronic_conditions: { type: DataTypes.TEXT },
  allergies: { type: DataTypes.TEXT },
  user_id: { type: DataTypes.INTEGER, unique: true },
});

// Doctor
const Doctor = sequelize.define("Doctor", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hospital_id: { type: DataTypes.INTEGER, allowNull: false },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  middle_name: { type: DataTypes.STRING, allowNull: false },
  specialization: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  office_number: { type: DataTypes.STRING },
  room_number: { type: DataTypes.STRING },
  photo_url: { type: DataTypes.STRING },
  experience_start_date: { type: DataTypes.DATE },
  bio: { type: DataTypes.TEXT },
  user_id: { type: DataTypes.INTEGER, unique: true },
});

// Doctor Schedule
const DoctorSchedule = sequelize.define("DoctorSchedule", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  doctor_id: { type: DataTypes.INTEGER, allowNull: false },
  appointment_date: { type: DataTypes.DATEONLY, allowNull: false },
  start_time: { type: DataTypes.TIME, allowNull: false },
  end_time: { type: DataTypes.TIME, allowNull: false },
  is_booked: { type: DataTypes.BOOLEAN, defaultValue: false },
});

// Appointment
const Appointment = sequelize.define("Appointment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patient_id: { type: DataTypes.INTEGER, allowNull: false },
  doctor_id: { type: DataTypes.INTEGER, allowNull: false },
  doctor_schedule_id: { type: DataTypes.INTEGER, allowNull: false },
  status: {
    type: DataTypes.ENUM("Scheduled", "Completed", "Cancelled"),
    defaultValue: "Scheduled",
  },
  notes: { type: DataTypes.TEXT },
});

// Medical Record
const MedicalRecord = sequelize.define("MedicalRecord", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patient_id: { type: DataTypes.INTEGER, allowNull: false },
  doctor_id: { type: DataTypes.INTEGER, allowNull: false },
  diagnosis: { type: DataTypes.TEXT },
  treatment: { type: DataTypes.TEXT },
  record_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// Prescription
const Prescription = sequelize.define("Prescription", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patient_id: { type: DataTypes.INTEGER, allowNull: false },
  doctor_id: { type: DataTypes.INTEGER, allowNull: false },
  medical_record_id: { type: DataTypes.INTEGER },
  medication: { type: DataTypes.STRING },
  dosage: { type: DataTypes.STRING },
  instructions: { type: DataTypes.TEXT },
  prescribed_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// Lab Test Info
const LabTestInfo = sequelize.define("LabTestInfo", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  description: { type: DataTypes.TEXT },
  duration_minutes: { type: DataTypes.INTEGER },
});

// Hospital Lab Service
const HospitalLabService = sequelize.define("HospitalLabService", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hospital_id: { type: DataTypes.INTEGER, allowNull: false },
  lab_test_info_id: { type: DataTypes.INTEGER, allowNull: false },
  doctor_id: { type: DataTypes.INTEGER, allowNull: false },
});

// Lab Test Schedule
const LabTestSchedule = sequelize.define("LabTestSchedule", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hospital_lab_service_id: { type: DataTypes.INTEGER, allowNull: false },
  appointment_date: { type: DataTypes.DATEONLY, allowNull: false },
  start_time: { type: DataTypes.DATE, allowNull: false },
  end_time: { type: DataTypes.DATE, allowNull: false },
  is_booked: { type: DataTypes.BOOLEAN, defaultValue: false },
});

// Lab Test
const LabTest = sequelize.define("LabTest", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patient_id: { type: DataTypes.INTEGER, allowNull: false },
  doctor_id: { type: DataTypes.INTEGER, allowNull: false },
  lab_test_schedule_id: { type: DataTypes.INTEGER, allowNull: false },
  results: { type: DataTypes.TEXT },
  notes: { type: DataTypes.TEXT },
});

// Financial Report
const FinancialReport = sequelize.define("FinancialReport", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hospital_id: { type: DataTypes.INTEGER, allowNull: false },
  report_date: { type: DataTypes.DATE },
  total_income: { type: DataTypes.DECIMAL(10, 2) },
  total_expenses: { type: DataTypes.DECIMAL(10, 2) },
});

// Analytics
const Analytics = sequelize.define("Analytics", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hospital_id: { type: DataTypes.INTEGER, allowNull: false },
  metric: { type: DataTypes.STRING },
  value: { type: DataTypes.DECIMAL(10, 2) },
  recorded_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// Review (Polymorphic)
const Review = sequelize.define("Review", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  target_type: { type: DataTypes.ENUM("Doctor", "Hospital"), allowNull: false },
  target_id: { type: DataTypes.INTEGER, allowNull: false },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
  comment: { type: DataTypes.TEXT },
});

// User
User.hasOne(Patient, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasOne(Doctor, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasOne(HospitalStaff, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Review, { foreignKey: "user_id", onDelete: "CASCADE" });

Patient.belongsTo(User, { foreignKey: "user_id" });
Doctor.belongsTo(User, { foreignKey: "user_id" });
HospitalStaff.belongsTo(User, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });

// Hospital
Hospital.hasMany(Patient, { foreignKey: "hospital_id", onDelete: "CASCADE" });
Hospital.hasMany(Doctor, { foreignKey: "hospital_id", onDelete: "CASCADE" });
Hospital.hasMany(HospitalStaff, {
  foreignKey: "hospital_id",
  onDelete: "CASCADE",
});
Hospital.hasMany(FinancialReport, { foreignKey: "hospital_id" });
Hospital.hasMany(Analytics, { foreignKey: "hospital_id" });
Hospital.hasMany(HospitalLabService, { foreignKey: "hospital_id" });

Patient.belongsTo(Hospital, { foreignKey: "hospital_id" });
Doctor.belongsTo(Hospital, { foreignKey: "hospital_id" });
HospitalStaff.belongsTo(Hospital, { foreignKey: "hospital_id" });

// Appointments
Doctor.hasMany(DoctorSchedule, {
  foreignKey: "doctor_id",
  onDelete: "CASCADE",
});
DoctorSchedule.belongsTo(Doctor, { foreignKey: "doctor_id" });

DoctorSchedule.hasMany(Appointment, {
  foreignKey: "doctor_schedule_id",
  onDelete: "CASCADE",
});
Appointment.belongsTo(DoctorSchedule, { foreignKey: "doctor_schedule_id" });

Doctor.hasMany(Appointment, { foreignKey: "doctor_id" });
Appointment.belongsTo(Doctor, { foreignKey: "doctor_id" });

Patient.hasMany(Appointment, { foreignKey: "patient_id" });
Appointment.belongsTo(Patient, { foreignKey: "patient_id" });

// Medical Records
Patient.hasMany(MedicalRecord, { foreignKey: "patient_id" });
Doctor.hasMany(MedicalRecord, { foreignKey: "doctor_id" });
MedicalRecord.belongsTo(Patient, { foreignKey: "patient_id" });
MedicalRecord.belongsTo(Doctor, { foreignKey: "doctor_id" });

MedicalRecord.hasMany(Prescription, { foreignKey: "medical_record_id" });
Prescription.belongsTo(MedicalRecord, { foreignKey: "medical_record_id" });

// Prescriptions
Doctor.hasMany(Prescription, { foreignKey: "doctor_id" });
Patient.hasMany(Prescription, { foreignKey: "patient_id" });
Prescription.belongsTo(Doctor, { foreignKey: "doctor_id" });
Prescription.belongsTo(Patient, { foreignKey: "patient_id" });

// Lab Tests
Doctor.hasMany(LabTest, { foreignKey: "doctor_id" });
Patient.hasMany(LabTest, { foreignKey: "patient_id" });
LabTest.belongsTo(Doctor, { foreignKey: "doctor_id" });
LabTest.belongsTo(Patient, { foreignKey: "patient_id" });

LabTestSchedule.hasMany(LabTest, { foreignKey: "lab_test_schedule_id" });
LabTest.belongsTo(LabTestSchedule, { foreignKey: "lab_test_schedule_id" });

HospitalLabService.hasMany(LabTestSchedule, {
  foreignKey: "hospital_lab_service_id",
});
LabTestSchedule.belongsTo(HospitalLabService, {
  foreignKey: "hospital_lab_service_id",
});

// Many-to-many: Hospital - LabTestInfo
Hospital.belongsToMany(LabTestInfo, {
  through: HospitalLabService,
  foreignKey: "hospital_id",
  otherKey: "lab_test_info_id",
});
LabTestInfo.belongsToMany(Hospital, {
  through: HospitalLabService,
  foreignKey: "lab_test_info_id",
  otherKey: "hospital_id",
});

module.exports = {
  User,
  Hospital,
  HospitalStaff,
  Patient,
  Doctor,
  DoctorSchedule,
  Appointment,
  MedicalRecord,
  Prescription,
  LabTest,
  LabTestSchedule,
  LabTestInfo,
  HospitalLabService,
  FinancialReport,
  Analytics,
  Review,
}