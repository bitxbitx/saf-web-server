const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *   Post:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         description: Post ID
 *         example: "611fda05f2d63e001bbcc7a1"
 *       platform:
 *         type: string
 *         enum:
 *           - "Facebook"
 *           - "Shopee"
 *           - "Instagram"
 *           - "Lazada"
 *           - "Twitter"
 *         description: Platform on which the post was made
 *         example: "Facebook"
 *       postId:
 *         type: string
 *         description: Unique ID of the post
 *         example: "1234567890"
 *       content:
 *         type: string
 *         description: Content of the post
 *         example: "Check out our latest products!"
 *       media:
 *         type: array
 *         items:
 *           type: string
 *         description: Array of media URLs associated with the post (if any)
 *         example:
 *           - "https://example.com/images/post1.jpg"
 *           - "https://example.com/videos/post1.mp4"
 *     required:
 *       - platform
 *       - postId
 *       - content
 *     # Add other required properties if applicable
 */
const PostSchema = new mongoose.Schema({
    platform: {
        type: String,
        enum: ['Facebook', 'Shopee', 'Instagram', 'Lazada', 'Twitter'],
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    media: [
        {
            type: String,
            required: false,
        },
    ],
}, { timestamps: true});

module.exports = mongoose.model('Post', PostSchema);
