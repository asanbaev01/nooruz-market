import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Продукт атын жазыңыз'],
      trim: true,
      maxlength: [100, 'Аты 100 белгиден ашпашы керек'],
    },
    description: {
      type: String,
      required: [true, 'Сүрөттөмө жазыңыз'],
      maxlength: [2000, 'Сүрөттөмө 2000 белгиден ашпашы керек'],
    },
    price: {
      type: Number,
      required: [true, 'Бааны жазыңыз'],
      min: [0, 'Баа терс болбойт'],
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    wholesalePrice: {
      type: Number,
      default: null,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Категория тандаңыз'],
    },
    image: {
      type: String,
      required: [true, 'Сүрөт кошуңуз'],
    },
    images: [
      {
        type: String,
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sellerName: {
      type: String,
      default: '',
    },
    origin: {
      type: String,
      default: '',
    },
    weight: {
      type: String,
      default: '',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: Number,
      default: 100,
      min: 0,
    },
    saleType: {
      type: String,
      enum: ['retail', 'wholesale', 'both'],
      default: 'retail',
    },
    badge: {
      type: String,
      enum: ['new', 'hit', 'sale', 'popular', 'organic', ''],
      default: '',
    },
    badgeText: {
      type: String,
      default: '',
    },
    popularity: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ====== Индекстер (издөө ылдамдатуу) ======
productSchema.index({ name: 'text', description: 'text', sellerName: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ popularity: -1 });

export default mongoose.model('Product', productSchema);