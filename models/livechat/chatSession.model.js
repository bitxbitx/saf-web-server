const mongoose = require('mongoose');
const Schema = mongoose.Schema

/**
 * @swagger
 * components:
 *  schemas:
 *   ChatSession:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         description: ChatSession ID
 *         example: "611fda05f2d63e001bbcc7a1"
 *       name:
 *         type: string
 *         description: Name of the chat session
 *         example: "Support Chat"
 *       participants:
 *         type: array
 *         description: List of participant IDs in the chat session
 *         items:
 *           type: string
 *           example: "611fda05f2d63e001bbcc7a1"
 *       messages:
 *         type: array
 *         description: List of chat message IDs in the chat session
 *         items:
 *           type: string
 *           example: "611fda05f2d63e001bbcc7a1"
 *       status:
 *         type: string
 *         enum:
 *           - "active"
 *           - "archived"
 *           - "closed"
 *         description: Status of the chat session
 *         example: "active"
 *     required:
 *       - name
 *       - participants
 *     # Add other required properties if applicable
 */
const ChatSessionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'ChatMessage'
  }],
  status: {
    type: String,
    enum: ['active', 'archived', 'closed'],
    default: 'active'
  }
},
  {
    timestamps: true,
  }
);

ChatSessionSchema.pre('save', async function (next) {
  if (this.name == null || this.name == '') {
    this.name = this.participants.map(participant => participant.name).join(', ');
  }
  next();
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema)