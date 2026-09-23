import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/validate.js';

/**
 * @desc   Продукттун пикирлери
 * @route  GET /api/reviews/product/:productId
 * @access Public
 */
export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [reviews, total] = await Promise.all([
    Review.find({ product: productId, isActive: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Review.countDocuments({ product: productId, isActive: true }),
  ]);

  return paginatedResponse(res, reviews, page, limit, total);
});

/**
 * @desc   Пикир жазуу
 * @route  POST /api/reviews
 * @access Private
 */
export const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) return errorResponse(res, 'Продукт табылган жок', 404);

  // Пикир мурун жазылганбы?
  const existing = await Review.findOne({ product: productId, user: req.user._id });
  if (existing) {
    return errorResponse(res, 'Сиз бул продуктка мурун пикир жаздыңыз', 400);
  }

  // Колдонуучу бул продуктту сатып алдыбы?
  const hasOrdered = await Order.findOne({
    user: req.user._id,
    'items.product': productId,
    status: { $in: ['delivered', 'confirmed'] },
  });

  if (!hasOrdered) {
    return errorResponse(res, 'Пикир жазуу үчүн бул продуктту сатып алышыңыз керек', 403);
  }

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    userName: req.user.name,
    userAvatar: req.user.avatar || '',
    rating,
    comment,
  });

  await review.populate('user', 'name avatar');

  return successResponse(res, review, 'Пикир кошулду', 201);
});

/**
 * @desc   Пикир оңдоо
 * @route  PUT /api/reviews/:id
 * @access Private
 */
export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return errorResponse(res, 'Пикир табылган жок', 404);

  if (review.user.toString() !== req.user._id.toString()) {
    return errorResponse(res, 'Уруксат жок', 403);
  }

  if (req.body.rating) review.rating = req.body.rating;
  if (req.body.comment) review.comment = req.body.comment;

  await review.save();
  await review.populate('user', 'name avatar');

  return successResponse(res, review, 'Пикир жаңыртылды');
});

/**
 * @desc   Пикир өчүрүү
 * @route  DELETE /api/reviews/:id
 * @access Private
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return errorResponse(res, 'Пикир табылган жок', 404);

  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return errorResponse(res, 'Уруксат жок', 403);
  }

  const productId = review.product;
  await review.deleteOne();

  // Рейтингти кайра эсептөө
  await Review.calcAverageRating(productId);

  return successResponse(res, null, 'Пикир өчүрүлдү');
});