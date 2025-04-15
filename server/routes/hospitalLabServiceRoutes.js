const express = require('express');
const router = express.Router();
const hospitalLabServiceController = require('../controllers/hospitalLabServiceController');

router.get('/', hospitalLabServiceController.getAll);
router.get('/:id', hospitalLabServiceController.getById);
router.post('/', hospitalLabServiceController.create);
router.put('/:id', hospitalLabServiceController.update);
router.delete('/:id', hospitalLabServiceController.delete);

module.exports = router;
