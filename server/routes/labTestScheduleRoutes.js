const express = require('express');
const router = express.Router();
const labTestScheduleController = require('../controllers/labTestScheduleController');

router.get('/', labTestScheduleController.getAll);
router.get('/:id', labTestScheduleController.getById);
router.post('/', labTestScheduleController.create);
router.put('/:id', labTestScheduleController.update);
router.delete('/:id', labTestScheduleController.delete);

module.exports = router;
