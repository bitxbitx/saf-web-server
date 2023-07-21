const asyncHandler = require('express-async-handler');
const Comment = require('../../models/social/comment.model');
/**
 * @swagger
 * tags:
 *   name: Social - Comment
 *   description: Social media comment management
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "comment_id"
 *         userId:
 *           type: string
 *           example: "user_id"
 *         content:
 *           type: string
 *           example: "This is a comment"
 *         createdAt:
 *           type: string
 *           example: "2023-07-21T12:34:56.789Z"
 *         updatedAt:
 *           type: string
 *           example: "2023-07-21T12:34:56.789Z"
 */

/**
 * @swagger
 * /api/social/comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Social - Comment]
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
 *                 example: "This is a comment"
 *     responses:
 *       '200':
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '500':
 *         description: Internal server error
 */
const createComment = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const comment = new Comment({ userId, ...req.body });
    await comment.save();
    res.json({ comment });
});

/**
 * @swagger
 * /api/social/comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Social - Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to retrieve
 *     responses:
 *       '200':
 *         description: Comment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '500':
 *         description: Internal server error
 */
const getComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    res.json({ comment });
});

/**
 * @swagger
 * /api/social/comments/{id}:
 *   put:
 *     summary: Update a comment
 *     tags: [Social - Comment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       '200':
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '500':
 *         description: Internal server error
 */
const updateComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findOneAndUpdate({_id:req.params.id}, req.body, {new: true})
    res.json({ comment });
});

/**
 * @swagger
 * /api/social/comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Social - Comment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to delete
 *     responses:
 *       '200':
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment removed"
 *       '500':
 *         description: Internal server error
 */
const deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Comment removed' });
});

/**
 * @swagger
 * /api/social/comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Social - Comment]
 *     responses:
 *       '200':
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       '500':
 *         description: Internal server error
 */

const getComments = asyncHandler(async (req, res) => {
    const comments = await Comment.find({});
    res.json({ comments });
});

module.exports = { createComment, getComment, updateComment, deleteComment, getComments };