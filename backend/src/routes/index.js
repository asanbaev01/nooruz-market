import express from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import cartRoutes from './cartRoutes.js';
import orderRoutes from './orderRoutes.js';
import favoriteRoutes from './favoriteRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import userRoutes from './userRoutes.js'; 

const router = express.Router();

/* ====== API роуттары ====== */
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/reviews', reviewRoutes);
router.use('/upload', uploadRoutes);
router.use('/users', userRoutes); 

/* ====== API маалыматы ====== */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Nooruz Market API v1.0',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        updateMe: 'PUT /api/auth/me',
        changePassword: 'PUT /api/auth/password',
      },
      products: {
        list: 'GET /api/products',
        detail: 'GET /api/products/:id',
        create: 'POST /api/products (seller)',
        update: 'PUT /api/products/:id (seller)',
        delete: 'DELETE /api/products/:id (seller)',
      },
      categories: {
        list: 'GET /api/categories',
        detail: 'GET /api/categories/:id',
      },
      cart: {
        get: 'GET /api/cart',
        add: 'POST /api/cart',
        update: 'PUT /api/cart/:itemId',
        remove: 'DELETE /api/cart/:itemId',
        clear: 'DELETE /api/cart',
      },
      orders: {
        create: 'POST /api/orders',
        my: 'GET /api/orders/my',
        detail: 'GET /api/orders/:id',
        cancel: 'PUT /api/orders/:id/cancel',
      },
      favorites: {
        list: 'GET /api/favorites',
        toggle: 'POST /api/favorites/:productId',
        remove: 'DELETE /api/favorites/:productId',
      },
      reviews: {
        productReviews: 'GET /api/reviews/product/:productId',
        create: 'POST /api/reviews',
        update: 'PUT /api/reviews/:id',
        delete: 'DELETE /api/reviews/:id',
      },
      upload: {
        single: 'POST /api/upload',
        multiple: 'POST /api/upload/multiple',
        delete: 'DELETE /api/upload/:filename',
      },
    },
  });
});

export default router;