const asyncHandler = require('express-async-handler');
const Product = require('../../models/ecom/product.model');
const ProductVariant = require('../../models/ecom/productVariant.model');
const Article = require('../../models/ecom/article.model');
require('dotenv').config();

/**
 * @swagger
 * tags:
 *   name: Ecommerce - Product
 *   description: Ecommerce product management
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Product Name"
 *         description:
 *           type: string
 *           example: "Product Description"
 *         price:
 *           type: number
 *           example: 100.50
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             example: ["image_url_1", "image_url_2"]
 *         articles:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Article Title"
 *               content:
 *                 type: string
 *                 example: "Article Content"
 *               productVariants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Variant Name"
 *                     price:
 *                       type: number
 *                       example: 50.00
 *                     stockIntake:
 *                       type: integer
 *                       example: 100
 *     ProductResponse:
 *       type: object
 *       properties:
 *         product:
 *           $ref: '#/components/schemas/Product'
 *     ProductsResponse:
 *       type: object
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/ecom/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Ecommerce - Product]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       '200':
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       '500':
 *         description: Internal server error
 */
const createProduct = asyncHandler(async (req, res) => {
  console.log("req.body", req.body);
  const imagePaths = [];

  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      imagePaths.push(file.path);
    });
  }

  req.body.images = imagePaths.map(path => process.env.SERVER_URL + 'api/' + path);

  const product = new Product(req.body);
  await product.save();

  // Create article(s) for product
  const { articles } = req.body;
  const articlePromises = JSON.parse(articles).map(async (article) => {
    const newArticle = new Article({
      product: product._id,
      ...article,
    });
    await newArticle.save();
    // return article;

    // Create product variant(s) for article
    const { productVariants } = article;
    const productVariantPromises = productVariants.map(async (productVariant) => {
      const newProductVariant = new ProductVariant({
        article: newArticle._id,
        ...productVariant,
        stockIntake: productVariant.newStock,
      });
      await newProductVariant.save();
      return newProductVariant;
    });

    const createdProductVariants = await Promise.all(productVariantPromises);
  });
  const createdArticles = await Promise.all(articlePromises);


  res.json({ product });

});

/**
 * @swagger
 * /api/ecom/products:
 *   get:
 *     summary: Get all products
 *     tags: [Ecommerce - Product]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsResponse'
 *       '500':
 *         description: Internal server error
 */
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate({
      path: 'articles',
      populate: {
        path: 'productVariants',
      },
    });
  // .populate('articles.productVariants');
  res.json({ products });
});
  
/**
 * @swagger
 * /api/ecom/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Ecommerce - Product]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       '500':
 *         description: Internal server error
 */
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate({
      path: 'articles',
      populate: {
        path: 'productVariants',
      },
    });
  res.json({ product });
});

/**
 * @swagger
 * /api/ecom/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Ecommerce - Product]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       '200':
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       '500':
 *         description: Internal server error
 */
const updateProduct = asyncHandler(async (req, res) => {
  console.log("req.body", req.body);
  // Updating Product
  if (typeof req.body.images === 'string') { req.body.images = JSON.parse(req.body.images) }

  const imagePaths = req.body.images || [];

  if (req.files && req.files.length > 0) {
    // Iterate through each uploaded file
    req.files.forEach((file) => {
      imagePaths.push(process.env.SERVER_URL + 'api/' + file.path);
    });
  }

  req.body.images = imagePaths

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  );

  // Create or update article(s) for product
  const { articles } = req.body;
  const articlePromises = JSON.parse(articles).map(async (article) => {
    console.log("article", article)
    // Check if article exists
    const existingArticle = await Article.findOne({ _id: article._id });

    if (existingArticle) {
      // Update article
      const { _id, ...updateDataArticle } = article;
      const updatedArticle = await Article.findOneAndUpdate(
        { _id: existingArticle._id },
        {
          product: product._id,
          ...updateDataArticle,
        },
        { new: true }
      );

      // Create or update product variant(s) for article
      const { productVariants } = article;
      const productVariantPromises = productVariants.map(async (productVariant) => {

        // Check if product variant exists
        var existingProductVariant = await ProductVariant.findOne({ _id: productVariant._id });

        if (existingProductVariant) {
          // Update product variant
          const newPrice = parseInt(productVariant.price, 10);
          const newStock = parseInt(productVariant.newStock, 10);
          const { _id, ...updateDataProductVariant } = productVariant;
          const updatedProductVariant = await ProductVariant.findOneAndUpdate(
            { _id: existingProductVariant._id },
            {
              article: updatedArticle._id,
              ...updateDataProductVariant,
              price: newPrice,
              stockIntake: productVariant.newStock + productVariant.stockIntake,
            },
            { new: true }
          );
          return updatedProductVariant;
        } else {
          // Create product variant
          const productVariantObj = new ProductVariant({
            article: updatedArticle._id,
            ...productVariant,
          });

          await productVariantObj.save();

          return productVariantObj;
        }

      });

      // Check if there is any product variant to deleted
      const productVariantsToDelete = await ProductVariant.find({ article: updatedArticle._id });
      const productVariantIdsToDelete = productVariantsToDelete.map(productVariant => productVariant._id.toString());
      const productVariantIds = productVariants.map(productVariant => productVariant._id.toString());

      // Delete product variant(s)
      const productVariantsToDeleteIds = productVariantIdsToDelete.filter(productVariantId => !productVariantIds.includes(productVariantId));

      if (productVariantsToDeleteIds.length > 0) {
        await ProductVariant.deleteMany({ _id: { $in: productVariantsToDeleteIds } });
      }

    } else {
      // Create article
      const newArticle = new Article({
        product: product._id,
        ...article,
      });
      await newArticle.save();

      // Create product variant(s) for article
      const { productVariants } = article;
      const productVariantPromises = productVariants.map(async (productVariant) => {
        const newProductVariant = new ProductVariant({
          article: newArticle._id,
          ...productVariant,
          stockIntake: productVariant.stockIntake,
        });
        await newProductVariant.save();
        return newProductVariant;
      }
      );

      const createdProductVariants = await Promise.all(productVariantPromises);
    }

    const createdArticles = await Promise.all(articlePromises);
  })

  res.json({ product });
});

/**
 * @swagger
 * /api/ecom/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Ecommerce - Product]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       '500':
 *         description: Internal server error
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id });
  await ProductVariant.deleteMany({ product: req.params.id });

  // Delete product images
  const { images } = product;
  images.forEach((image) => {
    const imagePath = image.split(process.env.SERVER_URL + 'api/')[1];
    fs.unlinkSync(path.join(__dirname, '..', imagePath));
  });

  // Delete article(s) for product
  const articles = await Article.find({ product: req.params.id });
  articles.forEach(async (article) => {
    await ProductVariant.deleteMany({ article: article._id });
  });

  await Article.deleteMany({ product: req.params.id });

  res.json({ message: 'Product removed' });
});


module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
};
