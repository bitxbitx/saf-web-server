const mongoose = require('mongoose');
const Schema = mongoose.Schema

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