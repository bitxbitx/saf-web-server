const mongoose = require('mongoose');

const productVariantSchema = mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        attributes: {
            type: Map,
            of: String,
            default: {}
          },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
        },
        sku: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

productVariantSchema.virtual('addToCartCount', {
    ref: 'AddToCart',
    localField: '_id',
    foreignField: 'productVariant',
    count: true,
});


productVariantSchema.virtual('completedOrders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'orderItems',
    justOne: false,
    match: { status: 'completed' },
    options: { sort: { createdAt: -1 } },
  });

productVariantSchema.virtual('wishlistCount', {
    ref: 'Wishlist',
    localField: '_id',
    foreignField: 'productVariant',
    count: true,
});


productVariantSchema.virtual('sales').get(function () {
    // Calculate the total sales of this product variant
    // by iterating over each order item and adding up the
    // quantity of the item if it matches this product variant
    if (!this.completedOrders) {
        return 0;
    }
    return this.completedOrders.reduce((total, orderItem) => {
        if (orderItem.productVariant.equals(this._id)) {
            return total + orderItem.quantity;
        }
        return total;
    }, 0);
});

productVariantSchema.virtual('quantitySold').get(function () {
    // Calculate the total sales of this product variant
    // by iterating over each order item and adding up the
    // quantity of the item if it matches this product variant
    if (!this.completedOrders) {
        return 0;
    }
    return this.completedOrders.reduce((total, orderItem) => {
        if (orderItem.productVariant.equals(this._id)) {
            return total + orderItem.quantity;
        }
        return total;
    }, 0);
});


module.exports = mongoose.model('ProductVariant', productVariantSchema);
