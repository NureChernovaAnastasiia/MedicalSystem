const { Router } = require('express');
const userController = require('../controllers/userController');
const router = Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check);
router.put('/update/:id', userController.update); 
router.delete('/delete/:id', userController.delete); 
router.get('/:id', authMiddleware, userController.getUserById);

module.exports = router;