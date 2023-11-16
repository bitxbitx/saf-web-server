const asyncHandler = require('express-async-handler');
const Post = require('../../models/social/post.model');
/**
 * @swagger
 * tags:
 *   name: Social - Post
 *   description: Social media post management
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "post_id"
 *         userId:
 *           type: string
 *           example: "user_id"
 *         content:
 *           type: string
 *           example: "This is a sample post"
 *         createdAt:
 *           type: string
 *           example: "2023-07-21T12:34:56.789Z"
 *         updatedAt:
 *           type: string
 *           example: "2023-07-21T12:34:56.789Z"
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 */

/**
 * @swagger
 * /api/social/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Social - Post]
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
 *                 example: "This is a sample post"
 *     responses:
 *       '200':
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '500':
 *         description: Internal server error
 */
const createPost = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const post = new Post({ userId, ...req.body });
    await post.save();
    res.json({ post });
});

/**
 * @swagger
 * /api/social/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Social - Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to retrieve
 *     responses:
 *       '200':
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '500':
 *         description: Internal server error
 */
const getPost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('comments');
    res.json(post);
});

/**
 * @swagger
 * /api/social/posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Social - Post]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       '200':
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '500':
 *         description: Internal server error
 */
const updatePost = asyncHandler(async (req, res) => {
    try {
        const post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/social/posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Social - Post]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to delete
 *     responses:
 *       '200':
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post removed"
 *       '500':
 *         description: Internal server error
 */
const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Post removed' });
});

/**
 * @swagger
 * /api/social/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Social - Post]
 *     responses:
 *       '200':
 *         description: Posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       '500':
 *         description: Internal server error
 */
const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({}).populate('comments');
    res.json({ posts });
});

module.exports = { createPost, getPost, updatePost, deletePost, getPosts };