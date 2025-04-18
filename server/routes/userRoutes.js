const { Router } = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

const router = Router();

// login доступний усім
router.post('/login', userController.login);

// registration — можна зробити перевірку ролі у самому контроллері
router.post('/registration', authMiddleware, userController.registration);

// токен перевірки
router.get('/auth', authMiddleware, userController.check);

// тільки авторизовані
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/update/:id', authMiddleware, userController.update);

// тільки Admin може видаляти
router.delete('/delete/:id', authMiddleware, checkRole('Admin'), userController.delete);

module.exports = router;
