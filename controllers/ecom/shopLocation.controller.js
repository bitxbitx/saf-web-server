const asyncHandler = require('express-async-handler');
const ShopLocation = require('../../models/ecom/shopLocation.model');
/**
 * @swagger
 * tags:
 *   name: Ecommerce - Shop Location
 *   description: Ecommerce shop location management
 * components:
 *   schemas:
 *     ShopLocation:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Main Store"
 *         address:
 *           type: string
 *           example: "123 Main Street, City"
 *         latitude:
 *           type: number
 *           format: float
 *           example: 40.7128
 *         longitude:
 *           type: number
 *           format: float
 *           example: -74.0060
 *     ShopLocationResponse:
 *       type: object
 *       properties:
 *         shopLocation:
 *           $ref: '#/components/schemas/ShopLocation'
 *     ShopLocationsResponse:
 *       type: object
 *       properties:
 *         shopLocations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ShopLocation'
 */

/**
 * @swagger
 * /api/ecom/shop-locations:
 *   post:
 *     summary: Create a new shop location
 *     tags: [Ecommerce - Shop Location]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShopLocation'
 *     responses:
 *       '200':
 *         description: Shop location created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShopLocationResponse'
 *       '500':
 *         description: Internal server error
 */
const createShopLocation = asyncHandler(async (req, res) => {
    const shopLocation = new ShopLocation(req.body);
    await shopLocation.save();
    res.json({ shopLocation });
});

/**
 * @swagger
 * /api/ecom/shop-locations:
 *   get:
 *     summary: Get all shop locations
 *     tags: [Ecommerce - Shop Location]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of all shop locations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShopLocationsResponse'
 *       '500':
 *         description: Internal server error
 */
const getShopLocations = asyncHandler(async (req, res) => {
    const shopLocations = await ShopLocation.find({});
    res.json({ shopLocations });
});

/**
 * @swagger
 * /api/ecom/shop-locations/{id}:
 *   get:
 *     summary: Get a shop location by ID
 *     tags: [Ecommerce - Shop Location]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the shop location to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Shop location retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShopLocationResponse'
 *       '500':
 *         description: Internal server error
 */
const getShopLocation = asyncHandler(async (req, res) => {
    const shopLocation = await ShopLocation.findById(req.params.id);
    res.json({ shopLocation });
});

/**
 * @swagger
 * /api/ecom/shop-locations/{id}:
 *   put:
 *     summary: Update an existing shop location
 *     tags: [Ecommerce - Shop Location]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the shop location to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShopLocation'
 *     responses:
 *       '200':
 *         description: Shop location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShopLocationResponse'
 *       '500':
 *         description: Internal server error
 */
const updateShopLocation = asyncHandler(async (req, res) => {
    const shopLocation = await ShopLocation.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    console.log(shopLocation)
    res.json({ shopLocation });
});

/**
 * @swagger
 * /api/ecom/shop-locations/{id}:
 *   delete:
 *     summary: Delete a shop location by ID
 *     tags: [Ecommerce - Shop Location]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the shop location to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Shop location deleted successfully
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
const deleteShopLocation = asyncHandler(async (req, res) => {
    const shopLocation = await ShopLocation.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Shop location removed' });
});

module.exports = { createShopLocation, getShopLocations, getShopLocation, updateShopLocation, deleteShopLocation };