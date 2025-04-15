const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');

router.get('/', hospitalController.getAll);
router.get('/:id', hospitalController.getById);
router.post('/', hospitalController.create);
router.put('/:id', hospitalController.update);
router.delete('/:id', hospitalController.delete);

module.exports = router;
