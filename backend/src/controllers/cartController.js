import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/validate.js';

/* ====== Жардамчы: корзина алуу же жаратуу ====== */
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

/**
 * @desc   Корзина алуу
 * @route  GET /api/cart
 * @access Private
 */
export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  await cart.populate('items.product', 'name image price inStock');

  return successResponse(res, {
    items: cart.items,
    total: cart.total,
    count: cart.count,
  });
});

/**
 * @desc   Корзинага кошуу
 * @route  POST /api/cart
 * @access Private
 */
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, isWholesale = false } = req.body;

  const product = await Product.findById(productId);
  if (!product) return errorResponse(res, 'Продукт табылган жок', 404);
  if (!product.inStock) return errorResponse(res, 'Продукт кампада жок', 400);

  // Wholesale текшерүү
  if (isWholesale && product.saleType === 'retail') {
    return errorResponse(res, 'Бул продукт оптом сатылбайт', 400);
  }

  const price = isWholesale && product.wholesalePrice
    ? product.wholesalePrice
    : product.price;

  const cart = await getOrCreateCart(req.user._id);

  const existingIdx = cart.items.findIndex(
    (item) => item.product.toString() === productId && item.isWholesale === isWholesale
  );

  if (existingIdx > -1) {
    cart.items[existingIdx].quantity += quantity;
  } else {
    cart.items.push({
      product: product._id,
      quantity,
      price,
      isWholesale,
      name: product.name,
      image: product.image,
    });
  }

  await cart.save();
  await cart.populate('items.product', 'name image price inStock');

  return successResponse(res, {
    items: cart.items,
    total: cart.total,
    count: cart.count,
  }, 'Корзинага кошулду');
});

/**
 * @desc   Санды өзгөртүү
 * @route  PUT /api/cart/:itemId
 * @access Private
 */
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  if (quantity < 1) {
    return errorResponse(res, 'Сан 1ден кичине болбойт', 400);
  }

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(itemId);

  if (!item) return errorResponse(res, 'Продукт корзинада жок', 404);

  item.quantity = quantity;
  await cart.save();
  await cart.populate('items.product', 'name image price inStock');

  return successResponse(res, {
    items: cart.items,
    total: cart.total,
    count: cart.count,
  }, 'Сан жаңыртылды');
});

/**
 * @desc   Корзинадан өчүрүү
 * @route  DELETE /api/cart/:itemId
 * @access Private
 */
export const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const cart = await getOrCreateCart(req.user._id);

  cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
  await cart.save();
  await cart.populate('items.product', 'name image price inStock');

  return successResponse(res, {
    items: cart.items,
    total: cart.total,
    count: cart.count,
  }, 'Корзинадан өчүрүлдү');
});

/**
 * @desc   Корзинаны тазалоо
 * @route  DELETE /api/cart
 * @access Private
 */
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();

  return successResponse(res, { items: [], total: 0, count: 0 }, 'Корзина тазаланды');
});