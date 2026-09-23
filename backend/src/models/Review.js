import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      required: [true, 'Рейтинг жазыңыз'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Пикир жазыңыз'],
      maxlength: [1000, 'Пикир 1000 белгиден ашпашы керек'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ====== Бир колдонуучу бир продуктка бир жолу пикир жазат ======
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// ====== Пикир кошулгандан кийин продукттун рейтингин жаңыртуу ======
reviewSchema.statics.calcAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId, isActive: true } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  const Product = mongoose.model('Product');

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewsCount: stats[0].count,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: 5.0,
      reviewsCount: 0,
    });
  }
};

// ====== Пикир сакталгандан кийин ======
reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.product);
});

// ====== Пикир өчүрүлгөндөн кийин ======
reviewSchema.post('remove', function () {
  this.constructor.calcAverageRating(this.product);
});

export default mongoose.model('Review', reviewSchema);