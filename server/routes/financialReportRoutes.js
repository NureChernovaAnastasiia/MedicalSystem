const Router = require('express');
const router = new Router();
const controller = require('../controllers/financialReportController');

// 📊 Звіти
router.get('/report/day', controller.getTodayReport);
router.get('/report/month', controller.getMonthReport);
router.get('/report/year', controller.getYearReport);

module.exports = router;
