const asyncHandler = require('express-async-handler');
const Wishlist = require('../../models/ecom/wishlist.model');
/**
 * @swagger
 * tags:
 *   name: Ecommerce - Wishlist
 *   description: Ecommerce wishlist management
 * components:
 *   schemas:
 *     Wishlist:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           example: "user_id"
 *         product:
 *           type: string
 *           example: "product_id"
 *     WishlistResponse:
 *       type: object
 *       properties:
 *         wishlist:
 *           $ref: '#/components/schemas/Wishlist'
 *     WishlistsResponse:
 *       type: object
 *       properties:
 *         wishlists:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Wishlist'
 */

/**
 * @swagger
 * /api/ecom/wishlists:
 *   post:
 *     summary: Create a new wishlist
 *     tags: [Ecommerce - Wishlist]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wishlist'
 *     responses:
 *       '200':
 *         description: Wishlist created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WishlistResponse'
 *       '500':
 *         description: Internal server error
 */
const createWishlist = asyncHandler(async (req, res) => {
    const user = req.userId;
    const wishlist = new Wishlist({ user, ...req.body });
    await wishlist.save();
    res.json({ wishlist });
});

/**
 * @swagger
 * /api/ecom/wishlists:
 *   get:
 *     summary: Get all wishlists
 *     tags: [Ecommerce - Wishlist]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of all wishlists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WishlistsResponse'
 *       '500':
 *         description: Internal server error
 */
const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findById(req.params.id);
    res.json({ wishlist });
});

/**
 * @swagger
 * /api/ecom/wishlists/{id}:
 *   get:
 *     summary: Get a wishlist by ID
 *     tags: [Ecommerce - Wishlist]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the wishlist to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Wishlist retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WishlistResponse'
 *       '500':
 *         description: Internal server error
 */
const updateWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    res.json({ wishlist });
});

/**
 * @swagger
 * /api/ecom/wishlists/{id}:
 *   put:
 *     summary: Update an existing wishlist
 *     tags: [Ecommerce - Wishlist]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the wishlist to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wishlist'
 *     responses:
 *       '200':
 *         description: Wishlist updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WishlistResponse'
 *       '500':
 *         description: Internal server error
 */
const deleteWishlist = asyncHandler(async (req, res) => {
    const { product } = req.body;
    const wishlist = await Wishlist.findOneAndDelete({ user: req.params.id, product });
    res.json({ message: 'Wishlist removed' });
});

/**
 * @swagger
 * /api/ecom/wishlists/{id}:
 *   delete:
 *     summary: Delete a wishlist by ID
 *     tags: [Ecommerce - Wishlist]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the wishlist to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Wishlist deleted successfully
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
const getWishlists = asyncHandler(async (req, res) => {
    const wishlists = await Wishlist.find({});
    res.json({ wishlists });
});

/**
 * @swagger
 * /api/ecom/wishlists/user/{id}:
 *   get:
 *     summary: Get wishlists by user ID
 *     tags: [Ecommerce - Wishlist]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve wishlists for
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of wishlists for the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WishlistsResponse'
 *       '500':
 *         description: Internal server error
 */

const getWishlistByUser = asyncHandler(async (req, res) => {
    const wishlists = await Wishlist.find({ user: req.params.id })
      .populate({
        path: 'product',
        populate: {
          path: 'articles',
          populate: {
            path: 'productVariants',
          },
        },
      });
    console.log("Wishlists: ", wishlists);
    res.json({ wishlists });
  });
module.exports = { createWishlist, getWishlist, updateWishlist, deleteWishlist, getWishlists, getWishlistByUser };