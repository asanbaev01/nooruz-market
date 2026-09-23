import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/validate.js';

/**
 * @desc   Бардык категориялар
 * @route  GET /api/categories
 * @access Public
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });

  // Ар бир категорияга продукт санын кош
  const withCount = await Promise.all(
    categories.map(async (cat) => {
      const count = await Product.countDocuments({ category: cat._id, isActive: true });
      return { ...cat.toObject(), productsCount: count };
    })
  );

  return successResponse(res, withCount);
});

/**
 * @desc   Бир категория
 * @route  GET /api/categories/:id
 * @access Public
 */
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return errorResponse(res, 'Категория табылган жок', 404);
  return successResponse(res, category);
});

/**
 * @desc   Категория кошуу
 * @route  POST /api/categories
 * @access Private/Admin
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name, icon, image, description, order } = req.body;

  const exists = await Category.findOne({ name });
  if (exists) return errorResponse(res, 'Бул категория мурун бар', 400);

  const category = await Category.create({
    name, icon, image, description, order: order || 0,
  });

  return successResponse(res, category, 'Категория кошулду', 201);
});

/**
 * @desc   Категория оңдоо
 * @route  PUT /api/categories/:id
 * @access Private/Admin
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return errorResponse(res, 'Категория табылган жок', 404);

  ['name', 'icon', 'image', 'description', 'order', 'isActive'].forEach((f) => {
    if (req.body[f] !== undefined) category[f] = req.body[f];
  });

  await category.save();
  return successResponse(res, category, 'Категория жаңыртылды');
});

/**
 * @desc   Категория өчүрүү
 * @route  DELETE /api/categories/:id
 * @access Private/Admin
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return errorResponse(res, 'Категория табылган жок', 404);

  category.isActive = false;
  await category.save();

  return successResponse(res, null, 'Категория өчүрүлдү');
});