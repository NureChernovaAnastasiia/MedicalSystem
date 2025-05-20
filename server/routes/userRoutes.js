const { Router } = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');
const { registerValidation } = require('../validations/userValidation');
const { validationResult } = require('express-validator');

const router = Router();

// Middleware для перевірки валідації
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

router.post("/change-password", authMiddleware, userController.changePassword);

// login
router.post('/login', userController.login);

// registration
router.post('/registration', authMiddleware, registerValidation, validateRequest, userController.registration);

// auth check
router.get('/auth', authMiddleware, userController.check);

// only auth users
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/update/:id', authMiddleware, userController.update);

// only Admin
router.delete('/delete/:id', authMiddleware, checkRole('Admin'), userController.delete);

module.exports = router;
