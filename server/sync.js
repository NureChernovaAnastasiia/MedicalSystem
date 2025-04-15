require('dotenv').config(); 
const sequelize = require("./db");
require("./models/models");

sequelize.sync({ alter: true })
  .then(() => {
    console.log("Database schema updated successfully.");
    process.exit(); 
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
    process.exit(1);
  });
