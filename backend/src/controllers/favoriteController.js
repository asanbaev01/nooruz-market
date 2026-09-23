import Favorite from '../models/Favorite.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/validate.js';

/**
 * @desc   Тандалмаларды алуу
 * @route  GET /api/favorites
 * @access Private
 */
export const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user._id })
    .populate('product')
    .sort({ createdAt: -1 });

  const products = favorites
    .map((f) => f.product)
    .filter((p) => p && p.isActive);

  return successResponse(res, products);
});

/**
 * @desc   Тандалмаларга кошуу (toggle)
 * @route  POST /api/favorites/:productId
 * @access Private
 */
export const toggleFavorite = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) return errorResponse(res, 'Продукт табылган жок', 404);

  const existing = await Favorite.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existing) {
    await existing.deleteOne();
    return successResponse(res, { isFavorite: false }, 'Тандалмалардан алынды');
  }

  await Favorite.create({ user: req.user._id, product: productId });
  return successResponse(res, { isFavorite: true }, 'Тандалмаларга кошулду');
});

/**
 * @desc   Тандалмалардан өчүрүү
 * @route  DELETE /api/favorites/:productId
 * @access Private
 */
export const removeFavorite = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  await Favorite.findOneAndDelete({
    user: req.user._id,
    product: productId,
  });

  return successResponse(res, { isFavorite: false }, 'Тандалмалардан алынды');
});