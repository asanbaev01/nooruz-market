import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Атыңызды жазыңыз'],
      trim: true,
      minlength: [2, 'Аты кеминде 2 белги'],
      maxlength: [50, 'Аты 50 белгиден ашпашы керек'],
    },
    email: {
      type: String,
      required: [true, 'Email жазыңыз'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Туура email жазыңыз'],
    },
    password: {
      type: String,
      required: [true, 'Пароль жазыңыз'],
      minlength: [6, 'Пароль кеминде 6 белги'],
      select: false, // демейкиде кайтарылбайт
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'],
      default: 'buyer',
    },
    avatar: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ====== Паролду хештөө (save'дан мурун) ======
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ====== Паролду салыштыруу ======
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ====== Virtual: user'дун жарыялары ======
userSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'seller',
});

export default mongoose.model('User', userSchema);