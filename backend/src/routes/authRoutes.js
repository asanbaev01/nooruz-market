import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/* ====== Validation эрежелери ====== */
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Аты 2-50 белги болушу керек'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Туура email жазыңыз'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль кеминде 6 белги'),
  body('role')
    .optional()
    .isIn(['buyer', 'seller'])
    .withMessage('Роль buyer же seller болушу керек'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Туура email'),
  body('password').notEmpty().withMessage('Пароль жазыңыз'),
];

const updateValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('avatar').optional().trim(),
];

const passwordValidation = [
  body('currentPassword').notEmpty().withMessage('Учурдагы пароль жазыңыз'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Жаңы пароль кеминде 6 белги'),
];

/* ====== Routes ====== */
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateValidation, validate, updateMe);
router.put('/password', protect, passwordValidation, validate, changePassword);

export default router;