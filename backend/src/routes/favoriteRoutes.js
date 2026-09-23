import express from 'express';
import {
  getFavorites,
  toggleFavorite,
  removeFavorite,
} from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getFavorites);
router.post('/:productId', toggleFavorite);
router.delete('/:productId', removeFavorite);

export default router;