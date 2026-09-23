import express from 'express';
import { body, query } from 'express-validator';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/* ====== Validation ====== */
const createValidation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Аты 3-100 белги'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Сүрөттөмө кеминде 10 белги'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Баа оң сан болушу керек'),
  body('category')
    .isMongoId()
    .withMessage('Категория тандаңыз'),
  body('image')
    .notEmpty()
    .withMessage('Сүрөт кошуңуз'),
];

const updateValidation = [
  body('name').optional().trim().isLength({ min: 3, max: 100 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('price').optional().isFloat({ min: 0 }),
];

/* ====== Routes ====== */
// Public
router.get('/', getProducts);
router.get('/:id', getProductById);

// Seller/Admin
router.post('/', protect, authorize('seller', 'admin'), createValidation, validate, createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), updateValidation, validate, updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);

export default router;