import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/validate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc   Бир сүрөт жүктөө
 * @route  POST /api/upload
 * @access Private
 */
export const uploadSingle = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(res, 'Файл тандалган жок', 400);
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  return successResponse(
    res,
    {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: fileUrl,
      path: `/uploads/${req.file.filename}`,
    },
    'Сүрөт ийгиликтүү жүктөлдү',
    201
  );
});

/**
 * @desc   Көп сүрөт жүктөө
 * @route  POST /api/upload/multiple
 * @access Private
 */
export const uploadMultiple = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return errorResponse(res, 'Файлдар тандалган жок', 400);
  }

  const files = req.files.map((file) => ({
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
    path: `/uploads/${file.filename}`,
  }));

  return successResponse(res, files, `${files.length} сүрөт жүктөлдү`, 201);
});

/**
 * @desc   Сүрөт өчүрүү
 * @route  DELETE /api/upload/:filename
 * @access Private
 */
export const deleteFile = asyncHandler(async (req, res) => {
  const { filename } = req.params;

  // Коопсуздук: файл аты тек гана тамга+сан+чекит болушу керек
  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    return errorResponse(res, 'Файл аты туура эмес', 400);
  }

  const filePath = path.join(__dirname, '..', '..', 'uploads', filename);

  if (!fs.existsSync(filePath)) {
    return errorResponse(res, 'Файл табылган жок', 404);
  }

  fs.unlinkSync(filePath);

  return successResponse(res, null, 'Файл өчүрүлдү');
});