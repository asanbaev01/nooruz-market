import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nooruz Market API',
      version: '1.0.0',
      description: `
# 🛒 Nooruz Market REST API

Онлайн-маркет Nooruz Market үчүн толук REST API.

## 🔐 Авторизация
Көпчүлүк роуттар **JWT Bearer token** талап кылат.
1. \`POST /api/auth/register\` же \`POST /api/auth/login\` аркылуу токен ал
2. "Authorize" баскычын басып, токенди кой (\`Bearer <token>\`)
3. Анан корголгон роуттарга чакыруу жаса

## 📚 Endpoints
- 🔐 **Auth** — каттоо, кирүү, профиль
- 📦 **Products** — продукт CRUD
- 📁 **Categories** — категориялар
- 🛒 **Cart** — корзина
- 📋 **Orders** — буйрутмалар
- ❤️ **Favorites** — тандалмалар
- ⭐ **Reviews** — пикирлер
- 📤 **Upload** — сүрөт жүктөө
      `,
      contact: {
        name: 'Nooruz Market',
        email: 'info@nooruzmarket.kg',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development сервер',
      },
      {
        url: 'https://nooruz-market-api.onrender.com',
        description: 'Production сервер',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT токенди киргизиңиз (Bearer\'сыз)',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d1' },
            name: { type: 'string', example: 'Айкол Касымов' },
            email: { type: 'string', example: 'aikol@nooruz.kg' },
            role: { type: 'string', enum: ['buyer', 'seller', 'admin'] },
            avatar: { type: 'string' },
            rating: { type: 'number', example: 4.9 },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'Балгын помидор, 1кг' },
            description: { type: 'string' },
            price: { type: 'number', example: 120 },
            originalPrice: { type: 'number', example: 150 },
            wholesalePrice: { type: 'number', example: 100 },
            category: { type: 'string' },
            image: { type: 'string' },
            seller: { type: 'string' },
            sellerName: { type: 'string' },
            origin: { type: 'string' },
            weight: { type: 'string' },
            inStock: { type: 'boolean' },
            saleType: { type: 'string', enum: ['retail', 'wholesale', 'both'] },
            rating: { type: 'number' },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            product: { type: 'string' },
            name: { type: 'string' },
            image: { type: 'string' },
            price: { type: 'number' },
            quantity: { type: 'number' },
            isWholesale: { type: 'boolean' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            items: { type: 'array', items: { type: 'object' } },
            totalPrice: { type: 'number' },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'delivering', 'delivered', 'cancelled'],
            },
            address: { type: 'string' },
            phone: { type: 'string' },
            paymentMethod: { type: 'string', enum: ['cash', 'card', 'bank'] },
          },
        },
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            product: { type: 'string' },
            user: { type: 'string' },
            userName: { type: 'string' },
            userAvatar: { type: 'string' },
            rating: { type: 'number', min: 1, max: 5 },
            comment: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Ийгиликтүү' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Ката' },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Авторизация керек',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        NotFoundError: {
          description: 'Табылган жок',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: '🔐 Каттоо, кирүү, профиль' },
      { name: 'Products', description: '📦 Продукттар' },
      { name: 'Categories', description: '📁 Категориялар' },
      { name: 'Cart', description: '🛒 Корзина' },
      { name: 'Orders', description: '📋 Буйрутмалар' },
      { name: 'Favorites', description: '❤️ Тандалмалар' },
      { name: 'Reviews', description: '⭐ Пикирлер' },
      { name: 'Upload', description: '📤 Сүрөт жүктөө' },
    ],
  },
  apis: [
    path.join(__dirname, '..', 'routes', '*.js'),
    path.join(__dirname, 'swaggerDocs.js'), // биз жаза турган файл
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;