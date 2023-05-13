const mongoose = require('mongoose');

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
