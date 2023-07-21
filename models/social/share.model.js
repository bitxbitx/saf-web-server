const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *   Share:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         description: Share ID
 *         example: "611fda05f2d63e001bbcc7a1"
 *       user:
 *         type: string
 *         description: ID of the user who shared the post
 *         example: "611fda05f2d63e001bbcc7a1"
 *       post:
 *         type: string
 *         description: ID of the shared post
 *         example: "611fda05f2d63e001bbcc7a1"
 *       platform:
 *         type: string
 *         enum:
 *           - "Facebook"
 *           - "Twitter"
 *           - "Instagram"
 *           - "LinkedIn"
 *         description: Platform where the post was shared
 *         example: "Facebook"
 *       metadata:
 *         type: object
 *         additionalProperties:
 *           type: string
 *         description: Metadata associated with the share (if any)
 *         example:
 *           shared_from: "https://example.com/original-post"
 *     required:
 *       - user
 *       - post
 *       - platform
 *     # Add other required properties if applicable
 */
const ShareSchema = new mongoose.Schema({
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
    platform: {
        type: String,
        enum: ['Facebook', 'Twitter', 'Instagram', 'LinkedIn'],
        required: true,
    },
    metadata: {
        type: Map,
        of: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Share', ShareSchema);
