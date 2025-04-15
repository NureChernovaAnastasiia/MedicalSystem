const express = require('express');
const router = express.Router();
const labTestController = require('../controllers/labTestController');

router.get('/', labTestController.getAll);
router.get('/:id', labTestController.getById);
router.post('/', labTestController.create);
router.put('/:id', labTestController.update);
router.delete('/:id', labTestController.delete);

module.exports = router;
