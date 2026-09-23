import { errorResponse } from '../utils/apiResponse.js';

/**
 * 404 — маршрут табылбады
 */
export const notFound = (req, res, next) => {
  return errorResponse(res, `Маршрут табылган жок: ${req.method} ${req.originalUrl}`, 404);
};

/**
 * Глобалдык ката кармоочу
 */
export const errorHandler = (err, req, res, next) => {
  console.error('⚠️ Ката:', err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Ички сервер катасы';

  // Mongoose: туура эмес ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Туура эмес ID';
  }

  // Mongoose: validation катасы
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  // Mongo: duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Бул ${field} мурун колдонулган`;
  }

  // JWT катасы
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Жараксыз токен';
  }

  // JWT expired
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Токендин мөөнөтү бүттү';
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};