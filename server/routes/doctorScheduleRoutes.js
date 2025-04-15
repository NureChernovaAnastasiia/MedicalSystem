const express = require('express');
const router = express.Router();
const doctorScheduleController = require('../controllers/doctorScheduleController');

router.get('/', doctorScheduleController.getAll);
router.get('/:id', doctorScheduleController.getById);
router.post('/', doctorScheduleController.create);
router.put('/:id', doctorScheduleController.update);
router.delete('/:id', doctorScheduleController.delete);

module.exports = router;
