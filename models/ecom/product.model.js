const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name value'],
        },
        description: String,
        category: String,
        season: String,
        festival: String,
        articleNumber: String,
        color: String,
        size: String,
        stockCode: String,
        price: Number,
        promotionPrice: Number,
        stockPlace: String,
        images: [{
            type: String,
        }],
        status: {
            type: String,
            enum: ['active', 'inactive', 'closed'],
            default: 'active',
        },
        stockMapping: [{
            color: String,
            size: String,
            stock: Number,
        }]
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

module.exports = mongoose.model('Product', productSchema);
