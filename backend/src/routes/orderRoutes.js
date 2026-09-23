import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const createValidation = [
  body('address').trim().notEmpty().withMessage('Дарек жазыңыз'),
  body('phone').trim().notEmpty().withMessage('Телефон жазыңыз'),
  body('paymentMethod').optional().isIn(['cash', 'card', 'bank']),
];

const statusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'delivering', 'delivered', 'cancelled'])
    .withMessage('Статус туура эмес'),
];

// Бардык order роуттары авторизация талап кылат
router.use(protect);

router.post('/', createValidation, validate, createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

// Admin
router.get('/', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), statusValidation, validate, updateOrderStatus);

export default router;