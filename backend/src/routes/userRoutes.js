import express from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';  // ✅ authorize

const router = express.Router();

/* ====== БАРДЫК КОЛДОНУУЧУЛАР (ADMIN) ====== */
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
});

/* ====== БИР КОЛДОНУУЧУ (ADMIN) ====== */
router.get('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Колдонуучу табылган жок',
      });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

export default router;