const mongoose = require('mongoose');

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
