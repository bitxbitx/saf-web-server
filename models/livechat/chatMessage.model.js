const mongoose = require('mongoose');
const Schema = mongoose.Schema

/**
 * @swagger
 * components:
 *  schemas:
 *   ChatMessage:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         description: ChatMessage ID
 *         example: "611fda05f2d63e001bbcc7a1"
 *       sender:
 *         type: string
 *         description: ID of the user who sent the chat message
 *         example: "611fda05f2d63e001bbcc7a1"
 *       recipient:
 *         type: string
 *         description: ID of the user who received the chat message
 *         example: "611fda05f2d63e001bbcc7a1"
 *       text:
 *         type: string
 *         description: Content of the chat message
 *         example: "Hello, how are you?"
 *       isRead:
 *         type: boolean
 *         description: Flag indicating if the chat message has been read
 *         example: false
 *     required:
 *       - sender
 *       - recipient
 *       - text
 *     # Add other required properties if applicable
 */
const ChatMessageSchema = mongoose.Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('ChatMessage', ChatMessageSchema)