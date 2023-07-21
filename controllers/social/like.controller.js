const asyncHandler = require('express-async-handler');
const Like = require('../../models/social/like.model');
/**
 * @swagger
 * tags:
 *   name: Social - Like
 *   description: Social media likes management
 * components:
 *   schemas:
 *     Like:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "like_id"
 *         userId:
 *           type: string
 *           example: "user_id"
 *         postId:
 *           type: string
 *           example: "post_id"
 *         createdAt:
 *           type: string
 *           example: "2023-07-21T12:34:56.789Z"
 *         updatedAt:
 *           type: string
 *           example: "2023-07-21T12:34:56.789Z"
 */

/**
 * @swagger
 * /api/social/likes:
 *   post:
 *     summary: Create a new like
 *     tags: [Social - Like]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 example: "post_id"
 *     responses:
 *       '200':
 *         description: Like created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Like'
 *       '500':
 *         description: Internal server error
 */
const createLike = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const like = new Like({ userId, ...req.body });
    await like.save();
    res.json({ like });
});

/**
 * @swagger
 * /api/social/likes/{id}:
 *   get:
 *     summary: Get a like by ID
 *     tags: [Social - Like]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the like to retrieve
 *     responses:
 *       '200':
 *         description: Like retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Like'
 *       '500':
 *         description: Internal server error
 */
const getLike = asyncHandler(async (req, res) => {
    const like = await Like.findById(req.params.id);
    res.json({ like });
});

/**
 * @swagger
 * /api/social/likes/{id}:
 *   put:
 *     summary: Update a like
 *     tags: [Social - Like]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the like to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Like'
 *     responses:
 *       '200':
 *         description: Like updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Like'
 *       '500':
 *         description: Internal server error
 */
const updateLike = asyncHandler(async (req, res) => {
    const like = await Like.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    res.json({ like });
});

/**
 * @swagger
 * /api/social/likes/{id}:
 *   delete:
 *     summary: Delete a like by ID
 *     tags: [Social - Like]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the like to delete
 *     responses:
 *       '200':
 *         description: Like deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Like removed"
 *       '500':
 *         description: Internal server error
 */
const deleteLike = asyncHandler(async (req, res) => {
    const like = await Like.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Like removed' });
});

/**
 * @swagger
 * /api/social/likes:
 *   get:
 *     summary: Get all likes
 *     tags: [Social - Like]
 *     responses:
 *       '200':
 *         description: Likes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Like'
 *       '500':
 *         description: Internal server error
 */

const getLikes = asyncHandler(async (req, res) => {
    const likes = await Like.find({});
    res.json({ likes });
});

module.exports = { createLike, getLike, updateLike, deleteLike, getLikes };