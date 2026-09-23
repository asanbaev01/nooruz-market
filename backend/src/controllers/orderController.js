import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/validate.js';

/**
 * @desc   Буйрутма берүү
 * @route  POST /api/orders
 * @access Private
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { address, phone, paymentMethod = 'cash', comment = '' } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) {
    return errorResponse(res, 'Корзина бош', 400);
  }

  // Продукттарды текшерүү + запас текшерүү
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product || !product.inStock) {
      return errorResponse(res, `«${item.name}» кампада жок`, 400);
    }
    if (product.quantity < item.quantity) {
      return errorResponse(res, `«${item.name}» жетишсиз (${product.quantity} гана бар)`, 400);
    }
  }

  // Буйрутма жаратуу
  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map((item) => ({
      product: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      isWholesale: item.isWholesale,
    })),
    totalPrice: cart.total,
    address,
    phone,
    paymentMethod,
    comment,
    status: 'pending',
  });

  // Продукттардын санын азайтуу
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { quantity: -item.quantity },
    });
  }

  // Корзинаны тазалоо
  cart.items = [];
  await cart.save();

  return successResponse(res, order, 'Буйрутма ийгиликтүү кабыл алынды', 201);
});

/**
 * @desc   Колдонуучунун буйрутмалары
 * @route  GET /api/orders/my
 * @access Private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments({ user: req.user._id }),
  ]);

  return paginatedResponse(res, orders, page, limit, total);
});

/**
 * @desc   Бир буйрутма
 * @route  GET /api/orders/:id
 * @access Private
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) return errorResponse(res, 'Буйрутма табылган жок', 404);

  // Колдонуучу өзүнүкүбү же admin
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return errorResponse(res, 'Уруксат жок', 403);
  }

  return successResponse(res, order);
});

/**
 * @desc   Буйрутманы жокко чыгаруу
 * @route  PUT /api/orders/:id/cancel
 * @access Private
 */
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return errorResponse(res, 'Буйрутма табылган жок', 404);

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return errorResponse(res, 'Уруксат жок', 403);
  }

  if (!['pending', 'confirmed'].includes(order.status)) {
    return errorResponse(res, 'Бул буйрутманы жокко чыгаруу мүмкүн эмес', 400);
  }

  order.status = 'cancelled';
  await order.save();

  return successResponse(res, order, 'Буйрутма жокко чыгарылды');
});

/**
 * @desc   Бардык буйрутмалар (admin)
 * @route  GET /api/orders
 * @access Private/Admin
 */
export const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = {};
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  return paginatedResponse(res, orders, page, limit, total);
});

/**
 * @desc   Буйрутма статусун өзгөртүү (admin)
 * @route  PUT /api/orders/:id/status
 * @access Private/Admin
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return errorResponse(res, 'Буйрутма табылган жок', 404);

  order.status = status;
  if (status === 'delivered') order.deliveredAt = new Date();

  await order.save();

  return successResponse(res, order, 'Статус жаңыртылды');
});