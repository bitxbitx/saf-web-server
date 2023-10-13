const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *   Product:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         description: Product ID
 *         example: "611fda05f2d63e001bbcc7a1"
 *       name:
 *         type: string
 *         description: Name of the product
 *         example: "Product Name"
 *       description:
 *         type: string
 *         description: Description of the product
 *         example: "This is a product description."
 *       images:
 *         type: array
 *         description: List of image URLs associated with the product
 *         items:
 *           type: string
 *           example: "https://example.com/images/product1.jpg"
 *       status:
 *         type: string
 *         enum:
 *           - "active"
 *           - "inactive"
 *           - "closed"
 *         description: Status of the product
 *         example: "active"
 *       category:
 *         type: string
 *         description: Category of the product
 *         example: "Electronics"
 *       platform:
 *         type: string
 *         description: Platform associated with the product
 *         example: "Web"
 *       productLink:
 *         type: string
 *         description: Link to the product (if applicable)
 *         example: "https://example.com/products/product1"
 *       articles:
 *         type: array
 *         description: List of articles associated with the product
 *         items:
 *           $ref: '#/components/schemas/Article'
 *     required:
 *       - name
 *     # Add other required properties if applicable
 */
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
        articleNo: String,
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
        platform: {
            type: String,
        },
        productLink:{
            type: String,
        },        

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
