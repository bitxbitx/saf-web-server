const mongoose = require('mongoose');

const AddToCartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductVariant',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['added', 'purchased', 'removed'],
        default: 'added',
    },

},
    {
        timestamps: true,
    });

module.exports = mongoose.model('AddToCart', AddToCartSchema);
