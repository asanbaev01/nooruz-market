import express from 'express';
import { body } from 'express-validator';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Бардык cart роуттары авторизация талап кылат
router.use(protect);

const addValidation = [
  body('productId').isMongoId().withMessage('Продукт ID туура эмес'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Сан 1ден кем эмес'),
];

const updateValidation = [
  body('quantity').isInt({ min: 1 }).withMessage('Сан 1ден кем эмес'),
];

router.get('/', getCart);
router.post('/', addValidation, validate, addToCart);
router.put('/:itemId', updateValidation, validate, updateCartItem);
router.delete('/:itemId', removeFromCart);
router.delete('/', clearCart);

export default router;