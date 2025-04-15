const express = require('express');
const router = express.Router();
const labTestInfoController = require('../controllers/labTestInfoController');

router.get('/', labTestInfoController.getAll);
router.get('/:id', labTestInfoController.getById);
router.post('/', labTestInfoController.create);
router.put('/:id', labTestInfoController.update);
router.delete('/:id', labTestInfoController.delete);

module.exports = router;
