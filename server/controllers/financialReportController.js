const { FinancialReport, Hospital } = require('../models/models');
const { Op } = require('sequelize');

// 📊 Отримати загальну виручку по всіх клініках за обраний період
const getSummaryReport = async (req, res, next) => {
  try {
    const { from, to } = req.query;

    const where = {};
    if (from || to) {
      where.report_date = {};
      if (from) where.report_date[Op.gte] = new Date(from);
      if (to) where.report_date[Op.lte] = new Date(to);
    }

    const reports = await FinancialReport.findAll({
      where,
      include: [Hospital],
    });

    const summary = reports.reduce(
      (acc, r) => {
        acc.total_income += parseFloat(r.total_income || 0);
        acc.total_expenses += parseFloat(r.total_expenses || 0);
        return acc;
      },
      { total_income: 0, total_expenses: 0 }
    );

    res.json({ summary, reports });
  } catch (error) {
    console.error('Помилка отримання фінансового звіту:', error);
    return res.status(500).json({ message: 'Не вдалося отримати фінансовий звіт' });
  }
};

module.exports = {
  getSummaryReport,
};
