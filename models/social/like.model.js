const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *   Like:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         description: Like ID
 *         example: "611fda05f2d63e001bbcc7a1"
 *       user:
 *         type: string
 *         description: User ID who liked the post
 *         example: "611fda05f2d63e001bbcc7a1"
 *       post:
 *         type: string
 *         description: Post ID that was liked
 *         example: "611fda05f2d63e001bbcc7a1"
 *     required:
 *       - user
 *       - post
 *     # Add other required properties if applicable
 */
const LikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Like', LikeSchema);
