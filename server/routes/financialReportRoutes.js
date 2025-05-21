const express = require('express');
const router = express.Router();
const financialReportController = require('../controllers/financialReportController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/checkRoleMiddleware');

router.get(
  '/summary',
  authMiddleware,
  roleMiddleware('Admin'),
  financialReportController.getSummaryReport
);

module.exports = router;