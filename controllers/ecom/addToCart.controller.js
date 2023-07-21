const asyncHandler = require('express-async-handler');
const AddToCart = require('../../models/ecom/addToCart.model');
/**
 * @swagger
 * tags:
 *   name: Ecommerce - Cart
 *   description: Ecommerce cart management
 * components:
 *  schemas:
 *   AddToCart:
 *     type: object
 *     properties:
 *       product:
 *         type: string
 *         example: "product_id_here"
 *       quantity:
 *         type: integer
 *         example: 2
 *       productVariant:
 *         type: string
 *         example: "variant_id_here"
 *   CartResponse:
 *     type: object
 *     properties:
 *       cart:
 *         $ref: '#/components/schemas/AddToCart'
 */

/**
 * @swagger
 * /api/ecom/cart/add:
 *   post:
 *     summary: Add product to the cart
 *     tags: [Ecommerce - Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCart'
 *     responses:
 *       '200':
 *         description: Product added to cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *       '500':
 *         description: Internal server error
 */
const addToCart = asyncHandler(async (req, res) => {
    const { product, quantity, productVariant } = req.body;
    const userId = req.userId;

    // Check if it exist already by user and product
    const cartExist = await AddToCart.find({ userId, product, productVariant });
    if (cartExist.length > 0) {
        // Check if status is removed
        if (cartExist[0].status === 'removed') {
            cartExist[0].status = 'added';
            cartExist[0].quantity = quantity;
            await cartExist[0].save();
            res.json({ cart: cartExist[0] });
        } else if ((cartExist[0].status === 'added' || cartExist[0].status === 'purchased') && cartExist[0].quantity !== quantity) {
            cartExist[0].quantity = quantity;
            await cartExist[0].save();
            res.json({ cart: cartExist[0] });
        }
    } else {
        const cart = new AddToCart({ user: userId, product, quantity, productVariant });
        await cart.save();
        res.json({ cart });
    }
});


/**
 * @swagger
 * /api/ecom/cart/remove:
 *   post:
 *     summary: Remove product from the cart
 *     tags: [Ecommerce - Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "product_id_here"
 *     responses:
 *       '200':
 *         description: Product removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *       '400':
 *         description: Cart not found
 *       '500':
 *         description: Internal server error
 */
const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const userId = req.userId;

    // find and update status
    const cart = await AddToCart.find({ userId, productId });

    if (cart.length > 0) {
        cart[0].status = 'removed';
        await cart[0].save();
        res.json({ cart });
    } else {
        res.status(400).json({ error: 'Cart not found' });
    }
});

/**
 * @swagger
 * /api/ecom/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Ecommerce - Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: User's cart data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AddToCart'
 *       '401':
 *         description: Unauthorized, access token missing or invalid
 *       '500':
 *         description: Internal server error
 */
const getCart = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const cart = await AddToCart.find({ userId, status: 'added' }).populate('productId');
    res.json({ cart });
});

module.exports = { addToCart, removeFromCart, getCart };