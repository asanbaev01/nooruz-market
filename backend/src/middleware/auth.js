import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Колдонуучу киргенин текшерүү (милдеттүү)
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'Авторизация керек. Кирүү', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return errorResponse(res, 'Колдонуучу табылган жок', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Аккаунт бөгөттөлгөн', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Жараксыз токен', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Токендин мөөнөтү бүттү. Кайра кирүү', 401);
    }
    return errorResponse(res, 'Авторизация катасы', 401);
  }
};

/**
 * Ролду текшерүү (seller, admin)
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Авторизация керек', 401);
    }
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, `Роль ${req.user.role} уруксат эмес`, 403);
    }
    next();
  };
};

/**
 * Милдеттүү эмес авторизация (эгер токен бар бол — кошот)
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) req.user = user;
    }
  } catch (e) {
    // эч нерсе кылбайбыз
  }
  next();
};
/**
 * Admin гана
 */
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 'Авторизация керек', 401);
  }
  if (req.user.role !== 'admin') {
    return errorResponse(res, 'Бул аракет үчүн админ укугу керек', 403);
  }
  next();
};