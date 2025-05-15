const sequelize = require("../db");
const { DataTypes } = require("sequelize");

// User
const User = sequelize.define("User", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  username: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: "Пароль має бути від 6 до 100 символів"
      },
      isStrongPassword(value) {
        if (!/[A-Z]/.test(value)) {
          throw new Error("Пароль має містити хоча б одну велику літеру");
        }
        if (!/[a-z]/.test(value)) {
          throw new Error("Пароль має містити хоча б одну маленьку літеру");
        }
        if (!/\d/.test(value)) {
          throw new Error("Пароль має містити хоча б одну цифру");
        }        
      }
    }
  },
  email: { 
  type: DataTypes.STRING, 
  unique: true,
  allowNull: false,
  validate: {
    isEmail: {
      msg: "Некоректний формат email",
    },
    notEmpty: {
      msg: "Email не може бути порожнім",
    },
    len: {
      args: [5, 255],
      msg: "Email повинен бути від 5 до 255 символів",
    },
    isValidEmail(value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
      if (!emailRegex.test(value)) {
        throw new Error("Email має містити правильний домен (приклад: example@email.com)");
      }
      if (/\s/.test(value)) {
        throw new Error("Email не може містити пробіли");
      }
    },
  },
  set(value) {
    this.setDataValue('email', value.trim().toLowerCase());
  }
},

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
  // Type of hospital: Public or Private
  type: {
    type: DataTypes.ENUM("Державна", "Приватна"),
    allowNull: false,
    defaultValue: "Державна",
  },

  // Working hours (example: Mon-Fri 08:00-17:00)
  working_hours: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Пн-Пт 08:00-17:00",
  },
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
  doctor_id: {
  type: DataTypes.INTEGER,
  allowNull: true, // ← Тимчасово дозволити NULL
  references: {
    model: 'Doctors',
    key: 'id'
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
},
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
  appointment_date: { type: DataTypes.DATEONLY, allowNull: false },
  status: {
    type: DataTypes.ENUM("Scheduled", "Completed", "Cancelled"),
    defaultValue: "Scheduled",
  },
  notes: { type: DataTypes.TEXT }
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
  // Форма випуску (таблетки, краплі, мазь тощо)
  form: { type: DataTypes.STRING },
  // Скільки одиниць приймати (наприклад: 1 таблетка, 5 мл)
  quantity_per_dose: { type: DataTypes.STRING },
  // Частота прийому (наприклад: 2 рази на день)
  frequency: { type: DataTypes.STRING },
  // Строк дії рецепту (дата, до якої рецепт дійсний)
  prescription_expiration: { type: DataTypes.DATE },
});

// Lab Test Info
const LabTestInfo = sequelize.define("LabTestInfo", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  description: { type: DataTypes.TEXT },
  duration_days: { type: DataTypes.INTEGER },
  preparation: { type: DataTypes.TEXT },
  indications: { type: DataTypes.TEXT },
  is_ready: { type: DataTypes.BOOLEAN, defaultValue: false },
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

// Medical Service Info
const MedicalServiceInfo = sequelize.define("MedicalServiceInfo", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  description: { type: DataTypes.TEXT },
  preparation: { type: DataTypes.TEXT, allowNull: true },
  indications: { type: DataTypes.TEXT, allowNull: true },
  duration_minutes: { type: DataTypes.INTEGER },
  is_ready: { type: DataTypes.BOOLEAN, defaultValue: false },
});

// Hospital Medical Service (many-to-many hospital ↔ service)
const HospitalMedicalService = sequelize.define("HospitalMedicalService", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hospital_id: { type: DataTypes.INTEGER, allowNull: false },
  medical_service_info_id: { type: DataTypes.INTEGER, allowNull: false },
  doctor_id: { type: DataTypes.INTEGER, allowNull: false }, // Виконує процедуру
});

// Schedule for medical service
const MedicalServiceSchedule = sequelize.define("MedicalServiceSchedule", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hospital_medical_service_id: { type: DataTypes.INTEGER, allowNull: false },
  appointment_date: { type: DataTypes.DATEONLY, allowNull: false },
  start_time: { type: DataTypes.DATE, allowNull: false },
  end_time: { type: DataTypes.DATE, allowNull: false },
  is_booked: { type: DataTypes.BOOLEAN, defaultValue: false },
});

// Actual service record
const MedicalService = sequelize.define("MedicalService", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patient_id: { type: DataTypes.INTEGER, allowNull: false },
  doctor_id: { type: DataTypes.INTEGER, allowNull: false },
  medical_service_schedule_id: { type: DataTypes.INTEGER, allowNull: false },
  results: { type: DataTypes.TEXT },
  notes: { type: DataTypes.TEXT },
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


HospitalLabService.belongsTo(Hospital, { foreignKey: "hospital_id" });
Hospital.hasMany(HospitalLabService, { foreignKey: "hospital_id" });

HospitalLabService.belongsTo(Doctor, { foreignKey: "doctor_id" });
Doctor.hasMany(HospitalLabService, { foreignKey: "doctor_id" });

HospitalLabService.belongsTo(LabTestInfo, { foreignKey: "lab_test_info_id" });
LabTestInfo.hasMany(HospitalLabService, { foreignKey: "lab_test_info_id" });

LabTestSchedule.belongsTo(HospitalLabService, {
  foreignKey: "hospital_lab_service_id",
});
HospitalLabService.belongsTo(Hospital, {
  foreignKey: "hospital_id"
});

Review.belongsTo(Doctor, {
  foreignKey: "target_id",
  constraints: false,
  as: "doctorTarget"
});

Review.belongsTo(Hospital, {
  foreignKey: "target_id",
  constraints: false,
  as: "hospitalTarget"
})

Review.belongsTo(Patient, { foreignKey: 'user_id', targetKey: 'user_id' });
Patient.hasMany(Review, { foreignKey: 'user_id', sourceKey: 'user_id' });

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

// Many-to-many Hospital <-> MedicalServiceInfo
Hospital.belongsToMany(MedicalServiceInfo, {
  through: HospitalMedicalService,
  foreignKey: "hospital_id",
  otherKey: "medical_service_info_id",
});
MedicalServiceInfo.belongsToMany(Hospital, {
  through: HospitalMedicalService,
  foreignKey: "medical_service_info_id",
  otherKey: "hospital_id",
});

// Schedule and bookings
HospitalMedicalService.hasMany(MedicalServiceSchedule, {
  foreignKey: "hospital_medical_service_id",
});
MedicalServiceSchedule.belongsTo(HospitalMedicalService, {
  foreignKey: "hospital_medical_service_id",
});

MedicalServiceSchedule.hasMany(MedicalService, {
  foreignKey: "medical_service_schedule_id",
});
MedicalService.belongsTo(MedicalServiceSchedule, {
  foreignKey: "medical_service_schedule_id",
});

Doctor.hasMany(MedicalService, { foreignKey: "doctor_id" });
MedicalService.belongsTo(Doctor, { foreignKey: "doctor_id" });

Patient.hasMany(MedicalService, { foreignKey: "patient_id" });
MedicalService.belongsTo(Patient, { foreignKey: "patient_id" });

Doctor.hasMany(Patient, { foreignKey: "doctor_id" });
Patient.belongsTo(Doctor, { foreignKey: "doctor_id" });

MedicalRecord.hasMany(Prescription, { foreignKey: "medical_record_id", onDelete: "SET NULL" });
Prescription.belongsTo(MedicalRecord, { foreignKey: "medical_record_id" })

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
  MedicalServiceInfo,
  HospitalMedicalService,
  MedicalServiceSchedule,
  MedicalService,
};
