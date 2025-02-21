const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.ENUM('Patient', 'Doctor', 'Admin'), allowNull: false }
});

const Hospital = sequelize.define('Hospital', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING }
});

const HospitalStaff = sequelize.define('HospitalStaff', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hospital_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Hospitals', key: 'id' } },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING , unique: true },
    user_id: { type: DataTypes.INTEGER, unique: true, references: { model: 'Users', key: 'id' } }
});

const Patient = sequelize.define('Patient', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hospital_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Hospitals', key: 'id' } },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    birth_date: { type: DataTypes.DATEONLY },
    gender: { type: DataTypes.ENUM('Male', 'Female', 'Other') },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING , unique: true },
    address: { type: DataTypes.TEXT },
    user_id: { type: DataTypes.INTEGER, unique: true, references: { model: 'Users', key: 'id' } }
});

const Doctor = sequelize.define('Doctor', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hospital_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Hospitals', key: 'id' } },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    specialization: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING , unique: true },
    office_number: { type: DataTypes.STRING },
    user_id: { type: DataTypes.INTEGER, unique: true, references: { model: 'Users', key: 'id' } }
});

const Appointment = sequelize.define('Appointment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    patient_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Patients', key: 'id' } },
    doctor_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Doctors', key: 'id' } },
    appointment_date: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled'), defaultValue: 'Scheduled' },
    notes: { type: DataTypes.TEXT }
});

const MedicalRecord = sequelize.define('MedicalRecord', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    patient_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Patients', key: 'id' } },
    doctor_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Doctors', key: 'id' } },
    diagnosis: { type: DataTypes.TEXT },
    treatment: { type: DataTypes.TEXT },
    record_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

const Prescription = sequelize.define('Prescription', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    patient_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Patients', key: 'id' } },
    doctor_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Doctors', key: 'id' } },
    medication: { type: DataTypes.STRING },
    dosage: { type: DataTypes.STRING },
    instructions: { type: DataTypes.TEXT },
    prescribed_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

const LabTest = sequelize.define('LabTest', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    patient_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Patients', key: 'id' } },
    doctor_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Doctors', key: 'id' } },
    test_name: { type: DataTypes.STRING },
    test_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    results: { type: DataTypes.TEXT }
});

const FinancialReport = sequelize.define('FinancialReport', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hospital_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Hospitals', key: 'id' } },
    report_date: { type: DataTypes.DATE },
    total_income: { type: DataTypes.DECIMAL(10, 2) },
    total_expenses: { type: DataTypes.DECIMAL(10, 2) }
});

const Analytics = sequelize.define('Analytics', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hospital_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Hospitals', key: 'id' } },
    metric: { type: DataTypes.STRING },
    value: { type: DataTypes.DECIMAL(10, 2) },
    recorded_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// User relationships
User.hasOne(Patient, { foreignKey: 'user_id' });
User.hasOne(Doctor, { foreignKey: 'user_id' });
User.hasOne(HospitalStaff, { foreignKey: 'user_id' });

Patient.belongsTo(User, { foreignKey: 'user_id' });
Doctor.belongsTo(User, { foreignKey: 'user_id' });
HospitalStaff.belongsTo(User, { foreignKey: 'user_id' });

// Hospital relationships
Hospital.hasMany(Patient, { foreignKey: 'hospital_id' });
Hospital.hasMany(Doctor, { foreignKey: 'hospital_id' });
Hospital.hasMany(HospitalStaff, { foreignKey: 'hospital_id' });

Patient.belongsTo(Hospital, { foreignKey: 'hospital_id' });
Doctor.belongsTo(Hospital, { foreignKey: 'hospital_id' });
HospitalStaff.belongsTo(Hospital, { foreignKey: 'hospital_id' });

// Appointment relationships
Patient.hasMany(Appointment, { foreignKey: 'patient_id' });
Doctor.hasMany(Appointment, { foreignKey: 'doctor_id' });

Appointment.belongsTo(Patient, { foreignKey: 'patient_id' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctor_id' });

// MedicalRecord relationships
Patient.hasMany(MedicalRecord, { foreignKey: 'patient_id' });
Doctor.hasMany(MedicalRecord, { foreignKey: 'doctor_id' });

MedicalRecord.belongsTo(Patient, { foreignKey: 'patient_id' });
MedicalRecord.belongsTo(Doctor, { foreignKey: 'doctor_id' });

// Prescription relationships
Patient.hasMany(Prescription, { foreignKey: 'patient_id' });
Doctor.hasMany(Prescription, { foreignKey: 'doctor_id' });

Prescription.belongsTo(Patient, { foreignKey: 'patient_id' });
Prescription.belongsTo(Doctor, { foreignKey: 'doctor_id' });

// LabTest relationships
Patient.hasMany(LabTest, { foreignKey: 'patient_id' });
Doctor.hasMany(LabTest, { foreignKey: 'doctor_id' });

LabTest.belongsTo(Patient, { foreignKey: 'patient_id' });
LabTest.belongsTo(Doctor, { foreignKey: 'doctor_id' });

// FinancialReport relationships
Hospital.hasMany(FinancialReport, { foreignKey: 'hospital_id' });

FinancialReport.belongsTo(Hospital, { foreignKey: 'hospital_id' });

// Analytics relationships
Hospital.hasMany(Analytics, { foreignKey: 'hospital_id' });

Analytics.belongsTo(Hospital, { foreignKey: 'hospital_id' });


module.exports = {
    User,
    Hospital,
    HospitalStaff,
    Patient,
    Doctor,
    Appointment,
    MedicalRecord,
    Prescription,
    LabTest,
    FinancialReport,
    Analytics
};