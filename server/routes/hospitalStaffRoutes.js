const express = require('express');
const router = express.Router();
const hospitalStaffController = require('../controllers/hospitalStaffController');

router.get('/', hospitalStaffController.getAll);
router.get('/:id', hospitalStaffController.getById);
router.post('/', hospitalStaffController.create);
router.put('/:id', hospitalStaffController.update);
router.delete('/:id', hospitalStaffController.delete);

module.exports = router;
