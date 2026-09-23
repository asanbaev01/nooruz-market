import express from 'express';
import { body } from 'express-validator';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const createValidation = [
  body('productId').isMongoId().withMessage('Продукт ID туура эмес'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Рейтинг 1-5 аралыгында'),
  body('comment').trim().isLength({ min: 3 }).withMessage('Пикир кеминде 3 белги'),
];

const updateValidation = [
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ min: 3 }),
];

router.get('/product/:productId', getProductReviews);
router.post('/', protect, createValidation, validate, createReview);
router.put('/:id', protect, updateValidation, validate, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;