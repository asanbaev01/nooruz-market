import express from 'express';
import {
  uploadSingle as uploadSingleFile,
  uploadMultiple as uploadMultipleFiles,
  deleteFile,
} from '../controllers/uploadController.js';
import { uploadSingle, uploadMultiple } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Бардык upload роуттары авторизация талап кылат
router.use(protect);

/* ====== Routes ====== */
// Бир сүрөт
router.post('/', uploadSingle, uploadSingleFile);

// Көп сүрөт
router.post('/multiple', uploadMultiple, uploadMultipleFiles);

// Өчүрүү
router.delete('/:filename', deleteFile);

export default router;