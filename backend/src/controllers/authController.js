import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/validate.js';

/**
 * @desc   Каттоо
 * @route  POST /api/auth/register
 * @access Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'buyer' } = req.body;

  // Email мурун барбы?
  const exists = await User.findOne({ email });
  if (exists) {
    return errorResponse(res, 'Бул email мурун катталган', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: ['buyer', 'seller'].includes(role) ? role : 'buyer',
    avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(email)}`,
  });

  const token = generateToken(user._id, user.role);

  return successResponse(
    res,
    {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        rating: user.rating,
      },
    },
    'Каттоо ийгиликтүү!',
    201
  );
});

/**
 * @desc   Кирүү
 * @route  POST /api/auth/login
 * @access Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return errorResponse(res, 'Email же пароль туура эмес', 401);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return errorResponse(res, 'Email же пароль туура эмес', 401);
  }

  if (!user.isActive) {
    return errorResponse(res, 'Аккаунт бөгөттөлгөн', 403);
  }

  const token = generateToken(user._id, user.role);

  return successResponse(
    res,
    {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        rating: user.rating,
      },
    },
    `Кош келиңиз, ${user.name}!`
  );
});

/**
 * @desc   Учурдагы колдонуучу
 * @route  GET /api/auth/me
 * @access Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  return successResponse(res, {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    address: user.address,
    rating: user.rating,
    createdAt: user.createdAt,
  });
});

/**
 * @desc   Профиль оңдоо
 * @route  PUT /api/auth/me
 * @access Private
 */
export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, address, avatar } = req.body;

  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  return successResponse(
    res,
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
      rating: user.rating,
    },
    'Профиль жаңыртылды'
  );
});

/**
 * @desc   Пароль өзгөртүү
 * @route  PUT /api/auth/password
 * @access Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return errorResponse(res, 'Учурдагы пароль туура эмес', 400);
  }

  user.password = newPassword;
  await user.save();

  return successResponse(res, null, 'Пароль ийгиликтүү өзгөртүлдү');
});