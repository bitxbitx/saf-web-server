const asyncHandler = require('express-async-handler');
const Order = require('../../models/ecom/order.model');
const Product = require('../../models/ecom/product.model');

/**
 * @swagger
 * tags:
 *   name: Ecommerce - Order
 *   description: Ecommerce order management
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: "user_id_here"
 *         orderItems:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productVariant:
 *                 type: string
 *                 example: "product_variant_id_here"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *         totalPrice:
 *           type: number
 *           example: 100.50
 *         status:
 *           type: string
 *           example: "pending"
 *         promoCodeUsed:
 *           type: string
 *           example: "promo_code_id_here"
 *     OrderResponse:
 *       type: object
 *       properties:
 *         order:
 *           $ref: '#/components/schemas/Order'
 *     OrdersResponse:
 *       type: object
 *       properties:
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /api/ecom/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Ecommerce - Order]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       '200':
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       '500':
 *         description: Internal server error
 */
const createOrder = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const order = new Order({ userId, ...req.body });
    await order.save();
    res.json({ order });
});

/**
 * @swagger
 * /api/ecom/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Ecommerce - Order]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the order to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       '500':
 *         description: Internal server error
 */
const getOrder = asyncHandler(async (req, res) => {
    Order.findById(req.params.id)
    .populate({
        path: 'orderItems.productVariant',
        model: 'ProductVariant',
        populate: {
            path: 'product',
            model: 'Product'
        }   
    })
    .populate('promoCodeUsed')
    .populate('customer')
    .exec((err, order) => {
        console.log(order);
        if (err) {
            // handle error
        }
        res.json({ order });
    });

});

/**
 * @swagger
 * /api/ecom/orders/{id}:
 *   put:
 *     summary: Update an existing order
 *     tags: [Ecommerce - Order]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the order to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       '200':
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       '500':
 *         description: Internal server error
 */
const updateOrder = asyncHandler(async (req, res) => {
    const order = await Order.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).populate('customer').populate('promoCodeUsed');
    res.json({ order });
});


/**
 * @swagger
 * /api/ecom/orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Ecommerce - Order]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the order to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       '500':
 *         description: Internal server error
 */
const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Order removed' });
});


/**
 * @swagger
 * /api/ecom/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Ecommerce - Order]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdersResponse'
 *       '500':
 *         description: Internal server error
 */
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate({
        path: 'orderItems.productVariant',
        model: 'ProductVariant',
        populate: {
            path: 'product',
            model: 'Product'
        }   
    })
    .populate('promoCodeUsed')
    .populate('customer')
    .exec((err, orders) => {
        if (err) {
            // handle error
        }
        res.json({ orders });
    });
    // res.json({ orders });
});


/**
 * @swagger
 * /api/ecom/orders/user:
 *   get:
 *     summary: Get orders by user ID
 *     tags: [Ecommerce - Order]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of orders by user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdersResponse'
 *       '500':
 *         description: Internal server error
 */
const getOrdersByUser = asyncHandler(async (req, res) => {
    const orders = await Order.find({ customer: req.userId }).populate({
        path: 'orderItems.productVariant',
        model: 'ProductVariant',
        populate: {
            path: 'product',
            model: 'Product'
        }   
    })
    .populate('promoCodeUsed')
    .populate('customer')
    .exec((err, orders) => {
        if (err) {
            // handle error
        }
        res.json({ orders });
    });

});

module.exports = { createOrder, getOrder, updateOrder, deleteOrder, getOrders, getOrdersByUser };