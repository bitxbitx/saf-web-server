const asyncHandler = require('express-async-handler');
const Product = require('../../models/ecom/product.model');
const ProductVariant = require('../../models/ecom/productVariant.model');
/**
 * @swagger
 * tags:
 *   name: Ecommerce - Product Variant
 *   description: Ecommerce product variant management
 * components:
 *   schemas:
 *     ProductVariant:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           example: "Product ID"
 *         attributes:
 *           type: object
 *           example: {"color": "Red", "size": "M"}
 *         price:
 *           type: number
 *           format: float
 *           example: 29.99
 *         stockIntake:
 *           type: integer
 *           example: 100
 *     ProductVariantResponse:
 *       type: object
 *       properties:
 *         productVariant:
 *           $ref: '#/components/schemas/ProductVariant'
 *     ProductVariantsResponse:
 *       type: object
 *       properties:
 *         productVariants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductVariant'
 */

/**
 * @swagger
 * /api/ecom/product-variants:
 *   post:
 *     summary: Create a new product variant
 *     tags: [Ecommerce - Product Variant]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               attributes:
 *                 type: object
 *               price:
 *                 type: number
 *                 format: float
 *               stockIntake:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Product variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariantResponse'
 *       '500':
 *         description: Internal server error
 */
const createProductVariant = asyncHandler(async (req, res) => {
    console.log("req.body", req.body)

    // Change string to json for attributes
    if (req.body.attributes && typeof req.body.attributes == 'string') { req.body.attributes = JSON.parse(req.body.attributes) }

    const productVariant = new ProductVariant(req.body);
    await productVariant.save();
    res.json({ productVariant });
});

/**
 * @swagger
 * /api/ecom/product-variants:
 *   get:
 *     summary: Get all product variants
 *     tags: [Ecommerce - Product Variant]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of all product variants
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariantsResponse'
 *       '500':
 *         description: Internal server error
 */
const getProductVariants = asyncHandler(async (req, res) => {
    const productVariants = await ProductVariant.find({});
    res.json({ productVariants });
});

/**
 * @swagger
 * /api/ecom/product-variants/{id}:
 *   get:
 *     summary: Get a product variant by ID
 *     tags: [Ecommerce - Product Variant]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product variant to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Product variant retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariantResponse'
 *       '500':
 *         description: Internal server error
 */
const getProductVariant = asyncHandler(async (req, res) => {
    const productVariant = await ProductVariant.findById(req.params.id);
    res.json({ productVariant });
});

/**
 * @swagger
 * /api/ecom/product-variants/{id}:
 *   put:
 *     summary: Update an existing product variant
 *     tags: [Ecommerce - Product Variant]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product variant to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               attributes:
 *                 type: object
 *               price:
 *                 type: number
 *                 format: float
 *               stockIntake:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Product variant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariantResponse'
 *       '500':
 *         description: Internal server error
 */
const updateProductVariant = asyncHandler(async (req, res) => {
    console.log("req.body", req.body)

    // Change string to json for attributes
    if ( typeof req.body.attributes === 'string' )
    req.body.attributes = JSON.parse(req.body.attributes);

    const productVariant = await ProductVariant.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json({ productVariant });
});

/**
 * @swagger
 * /api/ecom/product-variants/{id}:
 *   delete:
 *     summary: Delete a product variant by ID
 *     tags: [Ecommerce - Product Variant]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product variant to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Product variant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariantResponse'
 *       '500':
 *         description: Internal server error
 */
const deleteProductVariant = asyncHandler(async (req, res) => {
    const productVariant = await ProductVariant.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Product variant removed' });
});

/**
 * @swagger
 * /api/ecom/products/{id}/variants:
 *   get:
 *     summary: Get all product variants by product ID
 *     tags: [Ecommerce - Product Variant]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product to retrieve variants
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of all product variants for the product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariantsResponse'
 *       '500':
 *         description: Internal server error
 */
const getProductVariantByProduct = asyncHandler(async (req, res) => {
    const productVariant = await ProductVariant.find({ product: req.params.id });
    res.json({ productVariant });
});

module.exports = { createProductVariant, getProductVariants, getProductVariant, updateProductVariant, deleteProductVariant, getProductVariantByProduct };