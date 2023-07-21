const asyncHandler = require('express-async-handler');
const ProductCategory = require('../../models/ecom/productCategory.model');
/**
 * @swagger
 * tags:
 *   name: Ecommerce - Product Category
 *   description: Ecommerce product category management
 * components:
 *   schemas:
 *     ProductCategory:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Category Name"
 *         description:
 *           type: string
 *           example: "Category Description"
 *         image:
 *           type: string
 *           format: uri
 *           example: "http://example.com/category-image.jpg"
 *     ProductCategoryResponse:
 *       type: object
 *       properties:
 *         productCategory:
 *           $ref: '#/components/schemas/ProductCategory'
 *     ProductCategoriesResponse:
 *       type: object
 *       properties:
 *         productCategories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductCategory'
 */

/**
 * @swagger
 * /api/ecom/product-categories:
 *   post:
 *     summary: Create a new product category
 *     tags: [Ecommerce - Product Category]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Product category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategoryResponse'
 *       '500':
 *         description: Internal server error
 */
const createProductCategory = asyncHandler(async (req, res) => {
    // Handle image upload
    if (req.file) { req.body.image = req.file.path }
    const productCategory = new ProductCategory( {...req.body });
    await productCategory.save();
    res.json({ productCategory });
});

/**
 * @swagger
 * /api/ecom/product-categories:
 *   get:
 *     summary: Get all product categories
 *     tags: [Ecommerce - Product Category]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of all product categories
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategoriesResponse'
 *       '500':
 *         description: Internal server error
 */
const getProductCategories = asyncHandler(async (req, res) => {
    const productCategories = await ProductCategory.find({});
    res.json({ productCategories });
});

/**
 * @swagger
 * /api/ecom/product-categories/{id}:
 *   get:
 *     summary: Get a product category by ID
 *     tags: [Ecommerce - Product Category]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product category to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Product category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategoryResponse'
 *       '500':
 *         description: Internal server error
 */
const getProductCategory = asyncHandler(async (req, res) => {
    const productCategory = await ProductCategory.findById(req.params.id);
    res.json({ productCategory });
});

/**
 * @swagger
 * /api/ecom/product-categories/{id}:
 *   put:
 *     summary: Update an existing product category
 *     tags: [Ecommerce - Product Category]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product category to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Product category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategoryResponse'
 *       '500':
 *         description: Internal server error
 */
const updateProductCategory = asyncHandler(async (req, res) => {
    // Handle image upload
    if (req.file) { req.body.image = req.file.path }
    const productCategory = await ProductCategory.findOneAndUpdate(
        { _id: req.params.id }, 
        {...req.body },
         { new: true }
         );
    res.json({ productCategory });
});

/**
 * @swagger
 * /api/ecom/product-categories/{id}:
 *   delete:
 *     summary: Delete a product category by ID
 *     tags: [Ecommerce - Product Category]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product category to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Product category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategoryResponse'
 *       '500':
 *         description: Internal server error
 */
const deleteProductCategory = asyncHandler(async (req, res) => {
    const productCategory = await ProductCategory.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Product category removed' });
});

module.exports = { createProductCategory, getProductCategories, getProductCategory, updateProductCategory, deleteProductCategory };