require('dotenv').config();
const sequelize = require("./db");
const {
  MedicalService,
  MedicalServiceSchedule,
  HospitalMedicalService,
  MedicalServiceInfo,
} = require("./models/models");

async function resetMedicalTables() {
  try {
    console.log("Dropping dependent tables with CASCADE...");

    // DROP CASCADE вручну через SQL
    await sequelize.query('DROP TABLE IF EXISTS "MedicalServices" CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS "MedicalServiceSchedules" CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS "HospitalMedicalServices" CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS "MedicalServiceInfos" CASCADE');

    console.log("Recreating tables...");
    await MedicalServiceInfo.sync({ alter: true });
    await HospitalMedicalService.sync({ alter: true });
    await MedicalServiceSchedule.sync({ alter: true });
    await MedicalService.sync({ alter: true });

    console.log("Medical service tables reset and updated.");
    process.exit();
  } catch (err) {
    console.error("Failed to reset medical tables:", err);
    process.exit(1);
  }
}

resetMedicalTables();
