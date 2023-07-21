const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *   Article:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         description: Article ID
 *         example: "611fda05f2d63e001bbcc7a1"
 *       articleNo:
 *         type: string
 *         description: Article number
 *         example: "ART123"
 *       color:
 *         type: string
 *         description: Color of the article
 *         example: "Blue"
 *       product:
 *         type: string
 *         description: ID of the product associated with the article
 *         example: "611fda05f2d63e001bbcc7a1"
 *       totalInventoryStock:
 *         type: integer
 *         description: Total inventory stock for the article's product
 *         example: 50
 *       productVariants:
 *         type: array
 *         description: List of product variants associated with the article
 *         items:
 *           $ref: '#/components/schemas/ProductVariant'
 *     required:
 *       - articleNo
 *       - color
 *       - product
 */

const articleSchema = mongoose.Schema(
  {
    articleNo: {
      type: String,
      required: [true, 'Please add a articleNo value'],
    },
    color: {
      type: String,
      required: [true, 'Please add a color value'],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


articleSchema.virtual('totalInventoryStock', {
  ref: 'ProductVariant',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
  pipeline: [
    {
      $group: {
        _id: '$product',
        totalInventoryStock: {
          $sum: '$stock',
        },
      },
    },
  ],
});

articleSchema.virtual('productVariants', {
  ref: 'ProductVariant',
  localField: '_id',
  foreignField: 'article',
});

// articleSchema.virtual('addToCartCount', {
//   ref: 'AddToCart',
//   localField: '_id',
//   foreignField: 'product',
//   count: true,
// });

// articleSchema.virtual('wishlistCount', {
//   ref: 'Wishlist',
//   localField: '_id',
//   foreignField: 'product',
//   count: true,
// });

// articleSchema.virtual('completedOrders', {
//   ref: 'Order',
//   localField: '_id',
//   foreignField: 'orderItems.productVariant',
//   justOne: false,
//   match: { status: 'completed' },
//   options: { sort: { createdAt: -1 } },
// });


module.exports = mongoose.model('Article', articleSchema);