const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *   Comment:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         description: Comment ID
 *         example: "611fda05f2d63e001bbcc7a1"
 *       user:
 *         type: string
 *         description: User ID who made the comment
 *         example: "611fda05f2d63e001bbcc7a1"
 *       content:
 *         type: string
 *         description: Content of the comment
 *         example: "Great post!"
 *       post:
 *         type: string
 *         description: Post ID to which the comment is related
 *         example: "611fda05f2d63e001bbcc7a1"
 *     required:
 *       - user
 *       - content
 *       - post
 *     # Add other required properties if applicable
 */
const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);