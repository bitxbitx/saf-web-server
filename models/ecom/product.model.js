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
        status: {
            type: String,
            enum: ['active', 'inactive', 'closed'],
            default: 'active',
        },
        category: {
            type: String,
        },
        platform: {
            type: String,
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

productSchema.virtual('articles', {
    ref: 'Article',
    localField: '_id',
    foreignField: 'product',
});

// productSchema.virtual('completedOrders').get(function () {
//     return this.articles.reduce((acc, article) => {
//         return acc + article.completedOrders.length;
//     }, 0);
// });

// productSchema.virtual('addToCartCount').get(function () {
//     return this.articles.reduce((acc, article) => {
//         return acc + article.addToCartCount;
//     }, 0);
// });

// productSchema.virtual('wishlistCount').get(function () {
//     return this.articles.reduce((acc, article) => {
//         return acc + article.wishlistCount;
//     }, 0);
// });

// productSchema.virtual('totalInventoryStock').get(function () {
//     return this.articles.reduce((acc, article) => {
//         return acc + article.totalInventoryStock[0].totalInventoryStock;
//     }, 0);
// });

module.exports = mongoose.model('Product', productSchema);
