import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Категория атын жазыңыз'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    icon: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ====== Кыргыз/орус тамгаларын латынга которуу ======
const translitMap = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'j', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'ң': 'ng', 'ө': 'o', 'ү': 'u',
};

// ====== Slug автоматтык жаратуу ======
categorySchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    // 1. Кичине тамгага
    // 2. Ар бир тамганы транслит кылуу
    // 3. Боштуктарды '-' болуп
    // 4. Тек гана a-z, 0-9, '-' калтыруу
    this.slug = this.name
      .toLowerCase()
      .split('')
      .map((char) => (translitMap[char] !== undefined ? translitMap[char] : char))
      .join('')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Эгер slug бош калса (мисалы, тек символдор) — ID кош
    if (!this.slug) {
      this.slug = 'category-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }
  }
  next();
});

export default mongoose.model('Category', categorySchema);