import express from 'express';
import { body } from 'express-validator';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const createValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Аты 2-50 белги'),
];

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', protect, authorize('admin'), createValidation, validate, createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;