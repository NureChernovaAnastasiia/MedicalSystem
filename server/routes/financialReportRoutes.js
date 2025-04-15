const express = require('express');
const router = express.Router();
const financialReportController = require('../controllers/financialReportController');

router.get('/', financialReportController.getAll);
router.get('/:id', financialReportController.getById);
router.post('/', financialReportController.create);
router.put('/:id', financialReportController.update);
router.delete('/:id', financialReportController.delete);

module.exports = router;
