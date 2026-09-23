import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

/* ====== Database'ке туташуу ====== */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB туташты');
  } catch (error) {
    console.error('❌ Туташуу катасы:', error.message);
    process.exit(1);
  }
};

/* ====== Категориялар ====== */
const categories = [
  { name: 'Жашылчалар', icon: '🥗', order: 1 },
  { name: 'Жемиштер', icon: '🍎', order: 2 },
  { name: 'Сүт азыктары', icon: '🥛', order: 3 },
  { name: 'Нан азыктары', icon: '🍞', order: 4 },
  { name: 'Эт азыктары', icon: '🍖', order: 5 },
  { name: 'Ичимдиктер', icon: '🥤', order: 6 },
  { name: 'Кургак жемиштер', icon: '🥜', order: 7 },
  { name: 'Бал жана таттуулар', icon: '🍯', order: 8 },
];

/* ====== Cover images ====== */
const COVERS = [
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&q=80',
  'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=600&q=80',
  'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
  'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80',
  'https://images.unsplash.com/photo-1622597467836-f3f9d7d4c3f5?w=600&q=80',
  'https://images.unsplash.com/photo-1599909533142-6b0f5d3f3c1e?w=600&q=80',
  'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
];

/* ====== Продукттар (36) ====== */
const productsData = [
  // Жашылчалар (5)
  { name: 'Балгын помидор, 1кг', price: 120, originalPrice: 150, wholesalePrice: 100, category: 'Жашылчалар', origin: 'Кыргызстан', weight: '1 кг', badge: 'popular', badgeText: 'Популярдуу', saleType: 'both', inStock: true },
  { name: 'Жашыл бадыран, 1кг', price: 90, wholesalePrice: 75, category: 'Жашылчалар', origin: 'Кыргызстан', weight: '1 кг', badge: 'new', badgeText: 'Жаңы', saleType: 'both', inStock: true },
  { name: 'Кызыл калемпир, 500гр', price: 85, category: 'Жашылчалар', origin: 'Кыргызстан', weight: '500 гр', badge: 'organic', badgeText: 'Табигый', saleType: 'retail', inStock: true },
  { name: 'Картошка, 5кг', price: 250, originalPrice: 320, wholesalePrice: 210, category: 'Жашылчалар', origin: 'Кыргызстан', weight: '5 кг', badge: 'sale', badgeText: 'Акция', saleType: 'both', inStock: true },
  { name: 'Сабиз, 1кг', price: 60, category: 'Жашылчалар', origin: 'Кыргызстан', weight: '1 кг', saleType: 'retail', inStock: true },

  // Жемиштер (5)
  { name: 'Алма, 1кг', price: 110, originalPrice: 140, wholesalePrice: 90, category: 'Жемиштер', origin: 'Кыргызстан', weight: '1 кг', badge: 'popular', badgeText: 'Популярдуу', saleType: 'both', inStock: true },
  { name: 'Бал, 500гр', price: 350, originalPrice: 420, wholesalePrice: 300, category: 'Жемиштер', origin: 'Кыргызстан', weight: '500 гр', badge: 'organic', badgeText: 'Табигый', saleType: 'both', inStock: true },
  { name: 'Жүзүм, 1кг', price: 220, wholesalePrice: 180, category: 'Жемиштер', origin: 'Өзбекстан', weight: '1 кг', saleType: 'both', inStock: true },
  { name: 'Банан, 1кг', price: 130, originalPrice: 160, category: 'Жемиштер', origin: 'Эквадор', weight: '1 кг', badge: 'sale', badgeText: 'Акция', saleType: 'retail', inStock: true },
  { name: 'Апельсин, 1кг', price: 150, category: 'Жемиштер', origin: 'Түркия', weight: '1 кг', saleType: 'retail', inStock: true },

  // Сүт азыктары (5)
  { name: 'Балгын сүт 3.2%, 1л', price: 75, originalPrice: 90, wholesalePrice: 60, category: 'Сүт азыктары', origin: 'Кыргызстан', weight: '1 л', badge: 'popular', badgeText: 'Популярдуу', saleType: 'both', inStock: true },
  { name: 'Айран, 500мл', price: 45, wholesalePrice: 35, category: 'Сүт азыктары', origin: 'Кыргызстан', weight: '500 мл', badge: 'organic', badgeText: 'Табигый', saleType: 'both', inStock: true },
  { name: 'Каймак, 250гр', price: 180, category: 'Сүт азыктары', origin: 'Кыргызстан', weight: '250 гр', saleType: 'retail', inStock: true },
  { name: 'Быштак, 500гр', price: 220, wholesalePrice: 180, category: 'Сүт азыктары', origin: 'Кыргызстан', weight: '500 гр', saleType: 'both', inStock: true },
  { name: 'Сары май, 200гр', price: 260, originalPrice: 300, category: 'Сүт азыктары', origin: 'Кыргызстан', weight: '200 гр', badge: 'sale', badgeText: 'Акция', saleType: 'retail', inStock: true },

  // Нан азыктары (5)
  { name: 'Борбордук нан, 1шт', price: 40, wholesalePrice: 30, category: 'Нан азыктары', origin: 'Кыргызстан', weight: '1 шт', badge: 'hit', badgeText: 'Хит', saleType: 'both', inStock: true },
  { name: 'Жогорку сорттугу ун, 2кг', price: 110, originalPrice: 140, wholesalePrice: 90, category: 'Нан азыктары', origin: 'Кыргызстан', weight: '2 кг', badge: 'popular', badgeText: 'Популярдуу', saleType: 'both', inStock: true },
  { name: 'Ак күрүч (Ала-Бука), 1кг', price: 180, wholesalePrice: 150, category: 'Нан азыктары', origin: 'Кыргызстан', weight: '1 кг', badge: 'popular', badgeText: 'Популярдуу', saleType: 'both', inStock: true },
  { name: 'Чай, 100г', price: 120, originalPrice: 150, category: 'Нан азыктары', origin: 'Кыргызстан', weight: '100 гр', badge: 'popular', badgeText: 'Популярдуу', saleType: 'retail', inStock: true },
  { name: 'Жашылча салаты, 300г', price: 95, originalPrice: 120, category: 'Нан азыктары', origin: 'Кыргызстан', weight: '300 гр', badge: 'hit', badgeText: 'Хит', saleType: 'retail', inStock: true },

  // Эт азыктары (4)
  { name: 'Уй эти, 1кг', price: 650, wholesalePrice: 580, category: 'Эт азыктары', origin: 'Кыргызстан', weight: '1 кг', badge: 'popular', badgeText: 'Популярдуу', saleType: 'both', inStock: true },
  { name: 'Тоок эти, 1кг', price: 380, originalPrice: 450, wholesalePrice: 330, category: 'Эт азыктары', origin: 'Кыргызстан', weight: '1 кг', badge: 'sale', badgeText: 'Акция', saleType: 'both', inStock: true },
  { name: 'Кой эти, 1кг', price: 720, wholesalePrice: 650, category: 'Эт азыктары', origin: 'Кыргызстан', weight: '1 кг', saleType: 'both', inStock: true },
  { name: 'Куурулган эт, 500г', price: 250, originalPrice: 320, category: 'Эт азыктары', origin: 'Кыргызстан', weight: '500 гр', badge: 'popular', badgeText: 'Популярдуу', saleType: 'both', inStock: true },

  // Ичимдиктер (4)
  { name: 'Табигый шире, 1л', price: 130, wholesalePrice: 110, category: 'Ичимдиктер', origin: 'Кыргызстан', weight: '1 л', badge: 'organic', badgeText: 'Табигый', saleType: 'both', inStock: true },
  { name: 'Минералдык суу, 1.5л', price: 35, wholesalePrice: 25, category: 'Ичимдиктер', origin: 'Кыргызстан', weight: '1.5 л', saleType: 'both', inStock: true },
  { name: 'Компот, 1л', price: 90, category: 'Ичимдиктер', origin: 'Кыргызстан', weight: '1 л', saleType: 'retail', inStock: true },
  { name: 'Кымыз, 1л', price: 180, category: 'Ичимдиктер', origin: 'Кыргызстан', weight: '1 л', badge: 'organic', badgeText: 'Табигый', saleType: 'retail', inStock: true },

  // Кургак жемиштер (4)
  { name: 'Курут, 500г', price: 220, wholesalePrice: 180, category: 'Кургак жемиштер', origin: 'Кыргызстан', weight: '500 гр', badge: 'popular', badgeText: 'Популярдуу', saleType: 'both', inStock: true },
  { name: 'Мейиз, 500г', price: 180, category: 'Кургак жемиштер', origin: 'Өзбекстан', weight: '500 гр', saleType: 'retail', inStock: true },
  { name: 'Грек жаңгагы, 500г', price: 420, originalPrice: 500, wholesalePrice: 380, category: 'Кургак жемиштер', origin: 'Кыргызстан', weight: '500 гр', badge: 'sale', badgeText: 'Акция', saleType: 'both', inStock: true },
  { name: 'Бадам, 300г', price: 350, category: 'Кургак жемиштер', origin: 'Иран', weight: '300 гр', saleType: 'retail', inStock: true },

  // Бал жана таттуулар (4)
  { name: 'Тоо балы, 1кг', price: 850, wholesalePrice: 750, category: 'Бал жана таттуулар', origin: 'Кыргызстан', weight: '1 кг', badge: 'organic', badgeText: 'Табигый', saleType: 'both', inStock: true },
  { name: 'Боорсок, 500г', price: 150, category: 'Бал жана таттуулар', origin: 'Кыргызстан', weight: '500 гр', badge: 'popular', badgeText: 'Популярдуу', saleType: 'retail', inStock: true },
  { name: 'Жем-жемиш консервасы, 500г', price: 200, category: 'Бал жана таттуулар', origin: 'Кыргызстан', weight: '500 гр', saleType: 'retail', inStock: true },
  { name: 'Шоколад, 100г', price: 120, originalPrice: 150, category: 'Бал жана таттуулар', origin: 'Кыргызстан', weight: '100 гр', badge: 'sale', badgeText: 'Акция', saleType: 'retail', inStock: true },
];

/* ====== Seed иштетүү ====== */
const seed = async () => {
  try {
    await connectDB();

    console.log('');
    console.log('🌱 Seed башталды...');
    console.log('');

    // 1. Эски маалыматты тазалоо
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
    ]);
    console.log('🗑️  Эски маалыматтар тазаланды');

    // 2. Demo seller колдонуучулар
    const sellers = await User.create([
      { name: 'Айкол Касымов', email: 'aikol@nooruz.kg', password: 'nooruz2024', role: 'seller' },
      { name: 'Салтанат Бакирова', email: 'saltanat@nooruz.kg', password: 'nooruz2024', role: 'seller' },
      { name: 'Эркин Мамытов', email: 'erkin@nooruz.kg', password: 'nooruz2024', role: 'seller' },
      { name: 'Алина Темирова', email: 'alina@nooruz.kg', password: 'nooruz2024', role: 'seller' },
      { name: 'Нурбек Сүйүнбеков', email: 'nurbek@nooruz.kg', password: 'nooruz2024', role: 'seller' },
    ]);
    console.log(`👥 ${sellers.length} seller колдонуучу жаратылды`);

    // 3. Категорияларды жаратуу (pre('save') иштеши үчүн цикл менен)
    const createdCategories = [];
    for (const cat of categories) {
      const created = await Category.create(cat);
      createdCategories.push(created);
    }
    console.log(`📁 ${createdCategories.length} категория жаратылды`);

    // Категория аттарынан ID'ге map
    const catMap = {};
    createdCategories.forEach((c) => { catMap[c.name] = c._id; });

    // 4. Продукттарды жаратуу
    const productsToCreate = productsData.map((p, i) => ({
      name: p.name,
      description: `${p.name} — жогорку сапаттуу, ${p.origin} өндүрүшүндөгү табигый азык. ${p.weight ? `Салмагы: ${p.weight}.` : ''} Биздин дүкөндөн эң мыкты баа менен ала аласыз.`,
      price: p.price,
      originalPrice: p.originalPrice || null,
      wholesalePrice: p.wholesalePrice || null,
      category: catMap[p.category],
      image: COVERS[i % COVERS.length],
      images: [COVERS[i % COVERS.length]],
      seller: sellers[i % sellers.length]._id,
      sellerName: sellers[i % sellers.length].name,
      origin: p.origin,
      weight: p.weight,
      inStock: p.inStock,
      quantity: 100,
      saleType: p.saleType,
      badge: p.badge || '',
      badgeText: p.badgeText || '',
      popularity: Math.floor(Math.random() * 100) + 20,
      rating: 4.5 + Math.random() * 0.5,
      reviewsCount: Math.floor(Math.random() * 50),
      isActive: true,
    }));

    const createdProducts = await Product.insertMany(productsToCreate);
    console.log(`📦 ${createdProducts.length} продукт жаратылды`);

    console.log('');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║  ✅ SEED ИЙГИЛИКТҮҮ БҮТТҮ                  ║');
    console.log('╠════════════════════════════════════════════╣');
    console.log(`║  👥 Sellers:      ${String(sellers.length).padEnd(25)}║`);
    console.log(`║  📁 Категориялар: ${String(createdCategories.length).padEnd(25)}║`);
    console.log(`║  📦 Продукттар:   ${String(createdProducts.length).padEnd(25)}║`);
    console.log('╚════════════════════════════════════════════╝');
    console.log('');
    console.log('🔐 Demo seller аккаунттары:');
    console.log('   📧 aikol@nooruz.kg / nooruz2024');
    console.log('   📧 saltanat@nooruz.kg / nooruz2024');
    console.log('');

    await mongoose.disconnect();
    console.log('🔌 MongoDB ажыратылды');
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Seed ката:', error.message);
    console.error(error.stack);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();