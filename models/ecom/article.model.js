const mongoose = require('mongoose');

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