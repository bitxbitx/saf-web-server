const asyncHandler = require('express-async-handler');
const PromoCode = require('../../models/ecom/promoCode.model');
const ProductCategory = require('../../models/ecom/productCategory.model');
/**
 * @swagger
 * tags:
 *   name: Ecommerce - Promo Code
 *   description: Ecommerce promo code management
 * components:
 *   schemas:
 *     PromoCode:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           example: "SUMMER20"
 *         discount:
 *           type: number
 *           format: float
 *           example: 0.2
 *         image:
 *           type: string
 *           format: uri
 *           example: "https://example.com/images/promo.png"
 *         productCategory:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductCategory'
 *     PromoCodeResponse:
 *       type: object
 *       properties:
 *         promoCode:
 *           $ref: '#/components/schemas/PromoCode'
 *     PromoCodesResponse:
 *       type: object
 *       properties:
 *         promoCodes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PromoCode'
 */

/**
 * @swagger
 * /api/ecom/promo-codes:
 *   post:
 *     summary: Create a new promo code
 *     tags: [Ecommerce - Promo Code]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               discount:
 *                 type: number
 *                 format: float
 *               image:
 *                 type: string
 *                 format: binary
 *               productCategory:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Promo code created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromoCodeResponse'
 *       '500':
 *         description: Internal server error
 */
const createPromoCode = asyncHandler(async (req, res) => {
    // console.log(req.body);
    if (req.file) { req.body.image = process.env.SERVER_URL + 'api/' + req.file.path }

    // Change string to JSON for productCategory
    if (typeof req.body.productCategory === 'string') {
        req.body.productCategory = JSON.parse(req.body.productCategory);
        // Extract only the _id
        req.body.productCategory = req.body.productCategory.map((item) => item._id);
    }

    const promoCode = new PromoCode(req.body);
    await promoCode.save();

    const brofkthisshit = await PromoCode.findById(promoCode._id.toString()).populate('productCategory');

    res.json({ promoCode: brofkthisshit });
});

/**
 * @swagger
 * /api/ecom/promo-codes:
 *   get:
 *     summary: Get all promo codes
 *     tags: [Ecommerce - Promo Code]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of all promo codes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromoCodesResponse'
 *       '500':
 *         description: Internal server error
 */
const getPromoCodes = asyncHandler(async (req, res) => {
    const promoCodes = await PromoCode.find({}).populate('productCategory');
    res.json({ promoCodes });
});

/**
 * @swagger
 * /api/ecom/promo-codes/{id}:
 *   get:
 *     summary: Get a promo code by ID
 *     tags: [Ecommerce - Promo Code]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the promo code to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Promo code retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromoCodeResponse'
 *       '500':
 *         description: Internal server error
 */
const getPromoCode = asyncHandler(async (req, res) => {
    const promoCode = await PromoCode.findById(req.params.id).populate('productCategory');
    res.json({ promoCode });
});

/**
 * @swagger
 * /api/ecom/promo-codes/{id}:
 *   put:
 *     summary: Update an existing promo code
 *     tags: [Ecommerce - Promo Code]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the promo code to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               discount:
 *                 type: number
 *                 format: float
 *               image:
 *                 type: string
 *                 format: binary
 *               productCategory:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Promo code updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromoCodeResponse'
 *       '500':
 *         description: Internal server error
 */
const updatePromoCode = asyncHandler(async (req, res) => {
    console.log(req.body);
    if (req.file) { req.body.image = process.env.SERVER_URL + 'api/' + req.file.path }

    // Change string to JSON for productCategory
    if (typeof req.body.productCategory === 'string') {
        req.body.productCategory = JSON.parse(req.body.productCategory);
        // Extract only the _id
        req.body.productCategory = req.body.productCategory.map((item) => item._id);
    }

    const promoCode = await PromoCode.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).populate('productCategory');
    res.json({ promoCode });
});

/**
 * @swagger
 * /api/ecom/promo-codes/{id}:
 *   delete:
 *     summary: Delete a promo code by ID
 *     tags: [Ecommerce - Promo Code]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the promo code to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Promo code deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error
 */
const deletePromoCode = asyncHandler(async (req, res) => {
    const promoCode = await PromoCode.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Promo code removed' });
});

module.exports = { createPromoCode, getPromoCodes, getPromoCode, updatePromoCode, deletePromoCode };