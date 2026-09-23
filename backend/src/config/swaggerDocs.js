/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Жаңы колдонуучу каттоо
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Асан Асанов
 *               email:
 *                 type: string
 *                 example: asan@nooruz.kg
 *               password:
 *                 type: string
 *                 example: parol123
 *               role:
 *                 type: string
 *                 enum: [buyer, seller]
 *                 example: buyer
 *     responses:
 *       201:
 *         description: Каттоо ийгиликтүү
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Ката
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Кирүү
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: aikol@nooruz.kg
 *               password:
 *                 type: string
 *                 example: nooruz2024
 *     responses:
 *       200:
 *         description: Кирүү ийгиликтүү (JWT токен кайтарат)
 *       401:
 *         description: Email же пароль туура эмес
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Учурдагы колдонуучу
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Колдонуучу маалыматы
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Продукт тизмеси (filter, sort, search, pagination)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Категория ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [popular, price-asc, price-desc, name, new]
 *       - in: query
 *         name: saleType
 *         schema:
 *           type: string
 *           enum: [retail, wholesale]
 *       - in: query
 *         name: badge
 *         schema:
 *           type: string
 *           enum: [new, hit, sale, popular, organic]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: Продукт тизмеси
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *   post:
 *     summary: Продукт кошуу (seller/admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price, category, image]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *               wholesalePrice:
 *                 type: number
 *               saleType:
 *                 type: string
 *                 enum: [retail, wholesale, both]
 *     responses:
 *       201:
 *         description: Продукт кошулду
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Бир продукт
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Продукт маалыматы
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   put:
 *     summary: Продукт оңдоо (seller/admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Продукт жаңыртылды
 *   delete:
 *     summary: Продукт өчүрүү (seller/admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Продукт өчүрүлдү
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Бардык категориялар
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Категория тизмеси
 *   post:
 *     summary: Категория кошуу (admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Категория кошулду
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Корзинаны алуу
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Корзина
 *   post:
 *     summary: Корзинага кошуу
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 default: 1
 *               isWholesale:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       200:
 *         description: Корзина жаңыртылды
 *   delete:
 *     summary: Корзинаны тазалоо
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Корзина тазаланды
 */

/**
 * @swagger
 * /api/cart/{itemId}:
 *   put:
 *     summary: Корзинадагы санды өзгөртүү
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Сан жаңыртылды
 *   delete:
 *     summary: Корзинадан өчүрүү
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Өчүрүлдү
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Буйрутма берүү
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [address, phone]
 *             properties:
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, bank]
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Буйрутма кабыл алынды
 *   get:
 *     summary: Бардык буйрутмалар (admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Буйрутма тизмеси
 */

/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Менин буйрутмаларым
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Буйрутма тизмеси
 */

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Буйрутманы жокко чыгаруу
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Буйрутма жокко чыгарылды
 */

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Тандалмаларды алуу
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Тандалмалар
 */

/**
 * @swagger
 * /api/favorites/{productId}:
 *   post:
 *     summary: Тандалмаларга кошуу/өчүрүү (toggle)
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ийгиликтүү
 */

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   get:
 *     summary: Продукттун пикирлери
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Пикирлер
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Пикир жазуу (сатып алгандан кийин)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, rating, comment]
 *             properties:
 *               productId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пикир кошулду
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Бир сүрөт жүктөө
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Сүрөт жүктөлдү
 */

/**
 * @swagger
 * /api/upload/multiple:
 *   post:
 *     summary: Көп сүрөт жүктөө (макс 10)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Сүрөттөр жүктөлдү
 */