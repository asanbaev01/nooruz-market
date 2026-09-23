import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/validate.js';

/**
 * @desc   Продукт тизмеси (filter, sort, search, pagination)
 * @route  GET /api/products
 * @access Public
 */
export const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    search,
    sort = 'popular',
    saleType,
    badge,
    inStock,
    page = 1,
    limit = 12,
  } = req.query;

  const filter = { isActive: true };

  if (category) filter.category = category;
  if (saleType && saleType !== 'all') filter.saleType = { $in: [saleType, 'both'] };
  if (badge) filter.badge = badge;
  if (inStock === 'true') filter.inStock = true;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { sellerName: { $regex: search, $options: 'i' } },
    ];
  }

  let sortOption = {};
  switch (sort) {
    case 'price-asc': sortOption = { price: 1 }; break;
    case 'price-desc': sortOption = { price: -1 }; break;
    case 'name': sortOption = { name: 1 }; break;
    case 'new': sortOption = { createdAt: -1 }; break;
    default: sortOption = { popularity: -1 };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  return paginatedResponse(res, products, page, limit, total);
});

/**
 * @desc   Бир продукт
 * @route  GET /api/products/:id
 * @access Public
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('seller', 'name avatar role rating');

  if (!product) {
    return errorResponse(res, 'Продукт табылган жок', 404);
  }

  return successResponse(res, product);
});

/**
 * @desc   Продукт кошуу (seller)
 * @route  POST /api/products
 * @access Private/Seller
 */
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name, description, price, originalPrice, wholesalePrice,
    category, image, images, origin, weight,
    inStock, quantity, saleType, badge, badgeText,
  } = req.body;

  const cat = await Category.findById(category);
  if (!cat) return errorResponse(res, 'Категория табылган жок', 404);

  const product = await Product.create({
    name, description, price,
    originalPrice: originalPrice || null,
    wholesalePrice: wholesalePrice || null,
    category,
    image,
    images: images || [],
    seller: req.user._id,
    sellerName: req.user.name,
    origin, weight,
    inStock: inStock !== undefined ? inStock : true,
    quantity: quantity || 100,
    saleType: saleType || 'retail',
    badge: badge || '',
    badgeText: badgeText || '',
  });

  return successResponse(res, product, 'Продукт кошулду', 201);
});

/**
 * @desc   Продукт оңдоо (ээси гана)
 * @route  PUT /api/products/:id
 * @access Private/Seller
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return errorResponse(res, 'Продукт табылган жок', 404);

  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return errorResponse(res, 'Уруксат жок', 403);
  }

  const fields = [
    'name', 'description', 'price', 'originalPrice', 'wholesalePrice',
    'category', 'image', 'images', 'origin', 'weight',
    'inStock', 'quantity', 'saleType', 'badge', 'badgeText',
  ];

  fields.forEach((f) => {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  });

  await product.save();

  return successResponse(res, product, 'Продукт жаңыртылды');
});

/**
 * @desc   Продукт өчүрүү
 * @route  DELETE /api/products/:id
 * @access Private/Seller
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return errorResponse(res, 'Продукт табылган жок', 404);

  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return errorResponse(res, 'Урукку жок', 403);
  }

  product.isActive = false;
  await product.save();

  return successResponse(res, null, 'Продукт өчүрүлдү');
});