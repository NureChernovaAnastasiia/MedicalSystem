const { FinancialReport, Hospital } = require('../models/models');
const { Op } = require('sequelize');

// 📅 Сьогоднішня дата
const getTodayReport = async (req, res, next) => {
  try {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const reports = await FinancialReport.findAll({
      where: {
        report_date: { [Op.gte]: start, [Op.lt]: end },
      },
      include: [Hospital],
    });

    const total_income = reports.reduce((sum, r) => sum + parseFloat(r.total_income || 0), 0);

    res.json({ period: 'day', date: start.toISOString().slice(0, 10), total_income, reports });
  } catch (error) {
    console.error('❌ Day report error:', error);
    res.status(500).json({ message: 'Помилка отримання денного звіту' });
  }
};

// 📆 Поточний місяць
const getMonthReport = async (req, res, next) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const reports = await FinancialReport.findAll({
      where: {
        report_date: { [Op.gte]: start, [Op.lt]: end },
      },
      include: [Hospital],
    });

    const total_income = reports.reduce((sum, r) => sum + parseFloat(r.total_income || 0), 0);

    res.json({ period: 'month', month: start.getMonth() + 1, year: start.getFullYear(), total_income, reports });
  } catch (error) {
    console.error('❌ Month report error:', error);
    res.status(500).json({ message: 'Помилка отримання місячного звіту' });
  }
};

// 📅 Поточний рік
const getYearReport = async (req, res, next) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);

    const reports = await FinancialReport.findAll({
      where: {
        report_date: { [Op.gte]: start, [Op.lt]: end },
      },
      include: [Hospital],
    });

    const total_income = reports.reduce((sum, r) => sum + parseFloat(r.total_income || 0), 0);

    res.json({ period: 'year', year: start.getFullYear(), total_income, reports });
  } catch (error) {
    console.error('❌ Year report error:', error);
    res.status(500).json({ message: 'Помилка отримання річного звіту' });
  }
};

module.exports = {
  getTodayReport,
  getMonthReport,
  getYearReport,
};
