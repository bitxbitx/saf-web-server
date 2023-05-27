const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name value'],
        },
        description: String,
        images: [{
            type: String,
        }],
        productCategory: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductCategory',
        }],
        // Example of attributes
        // attributes: {
        //   color: 'red|blue|green',
        //   size: 'M|L|XL',
        // }
        attributes: {
            type: Map,
            of: String,
        },
        // productDetails: String,
        status: {
            type: String,
            enum: ['active', 'archived', 'closed'],
            default: 'active',
        },
        productType: {
            type: String,
            enum: ['simple', 'variable'],
            default: 'simple',
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

productSchema.virtual('totalInventoryStock', {
    ref: 'ProductVariant',
    localField: '_id',
    foreignField: 'product',
    pipeline: [
        {
            $group: {
                _id: '$product',
                totalInventoryStock: {
                    $sum: '$inventoryStock',
                },
            },
        },
    ],
    justOne: true,
});


productSchema.virtual('addToCartCount', {
    ref: 'AddToCart',
    localField: '_id',
    foreignField: 'product',
    count: true,
    match: {
        createdAt: {
            $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        },
    },
});

productSchema.virtual('productVariant', {
    ref: 'ProductVariant',
    localField: '_id',
    foreignField: 'product',
});


productSchema.virtual('wishlistCount', {
    ref: 'Wishlist',
    localField: '_id',
    foreignField: 'product',
    count: true,
    match: {
        createdAt: {
            $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        },
    },
});

module.exports = mongoose.model('Product', productSchema);
