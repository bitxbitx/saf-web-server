const asyncHandler = require('express-async-handler');
const Share = require('../../models/social/share.model');
/**
 * @swagger
 * tags:
 *   name: Social - Share
 *   description: Social media sharing management
 * components:
 *   schemas:
 *     Share:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "share_id"
 *         userId:
 *           type: string
 *           example: "user_id"
 *         content:
 *           type: string
 *           example: "This is a shared post"
 *         createdAt:
 *           type: string
 *           example: "2023-07-21T12:34:56.789Z"
 *         updatedAt:
 *           type: string
 *           example: "2023-07-21T12:34:56.789Z"
 */

/**
 * @swagger
 * /api/social/shares:
 *   post:
 *     summary: Create a new share
 *     tags: [Social - Share]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is a shared post"
 *     responses:
 *       '200':
 *         description: Share created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Share'
 *       '500':
 *         description: Internal server error
 */
const createShare = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const share = new Share({ userId, ...req.body });
    await share.save();
    res.json({ share });
});

/**
 * @swagger
 * /api/social/shares/{id}:
 *   get:
 *     summary: Get a share by ID
 *     tags: [Social - Share]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the share to retrieve
 *     responses:
 *       '200':
 *         description: Share retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Share'
 *       '500':
 *         description: Internal server error
 */
const getShare = asyncHandler(async (req, res) => {
    const share = await Share.findById(req.params.id);
    res.json({ share });
});

/**
 * @swagger
 * /api/social/shares/{id}:
 *   put:
 *     summary: Update a share
 *     tags: [Social - Share]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the share to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Share'
 *     responses:
 *       '200':
 *         description: Share updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Share'
 *       '500':
 *         description: Internal server error
 */
const updateShare = asyncHandler(async (req, res) => {
    const share = await Share.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    res.json({ share });
});

/**
 * @swagger
 * /api/social/shares/{id}:
 *   delete:
 *     summary: Delete a share by ID
 *     tags: [Social - Share]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the share to delete
 *     responses:
 *       '200':
 *         description: Share deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Share removed"
 *       '500':
 *         description: Internal server error
 */
const deleteShare = asyncHandler(async (req, res) => {
    const share = await Share.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Share removed' });
});

/**
 * @swagger
 * /api/social/shares:
 *   get:
 *     summary: Get all shares
 *     tags: [Social - Share]
 *     responses:
 *       '200':
 *         description: Shares retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shares:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Share'
 *       '500':
 *         description: Internal server error
 */
const getShares = asyncHandler(async (req, res) => {
    const shares = await Share.find({});
    res.json({ shares });
});

module.exports = { createShare, getShare, updateShare, deleteShare, getShares };
