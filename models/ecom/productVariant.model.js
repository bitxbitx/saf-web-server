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
    foreignField: 'orderItems.productVariant',
    justOne: false,
    match: { status: 'completed' },
    options: { sort: { createdAt: -1 } },
  });

  productVariantSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'orderItems',
    justOne: false,
    match: { status: { $ne: 'cancelled' } },
    options: { sort: { createdAt: -1 } },
    });

productVariantSchema.virtual('wishlistCount', {
    ref: 'Wishlist',
    localField: '_id',
    foreignField: 'productVariant',
    count: true,
});

// productVariantSchema.virtual('sales').get(function () {
//     // Calculate the total sales of this product variant
//     // by iterating over each order item and adding up the
//     // quantity of the item if it matches this product variant
//     if (!this.completedOrders) {
//         return 0;
//     }

//     return this.completedOrders.reduce((total, order) => {
//         // loop through each order item and add up the quantity
//         // if the order item matches this product variant
//         order.orderItems.forEach((orderItem) => {
//             console.log("orderItem", orderItem)
//             if (orderItem.productVariant.equals(this._id)) {
//                                 total += orderItem.quantity * this.price ;
//             }
//         });
//         return total;
//     }, 0);
// });

// productVariantSchema.virtual('quantitySold').get(function () {
//     // Calculate the total sales of this product variant
//     // by iterating over each order item and adding up the
//     // quantity of the item if it matches this product variant
//     if (!this.completedOrders) {
//         return 0;
//     }
//     return this.completedOrders.reduce((total, order) => {
//         order.orderItems.forEach((orderItem) => {
//             console.log("orderItem.productVariant", orderItem.productVariant)
//             if (orderItem.productVariant.equals(this._id)) {
//                 console.log("orderItem.quantity", orderItem.quantity)
//                 total += orderItem.quantity ;
//             }
//         });
//         return total;
//     }, 0);
// });

productVariantSchema.virtual('sales').get(function () {
    const currentDate = new Date();
    const timeframeMap = {
      '7d': currentDate.setDate(currentDate.getDate() - 7),
      '30d': currentDate.setDate(currentDate.getDate() - 30),
      '90d': currentDate.setDate(currentDate.getDate() - 90),
      '365d': currentDate.setDate(currentDate.getDate() - 365),
    };
  
    const timeframeDate = this.timeframeDate || timeframeMap['30d']; // Use '30d' as default if timeframeDate is not provided

    if (!this.completedOrders) {
        return 0;
    }

    // Filter completed orders within the specified timeframe
    console.log("this.completedOrders", this.completedOrders)
    const completedOrders = this.completedOrders.filter(
      (order) => order.createdAt >= timeframeDate
    );
  
    if (!completedOrders) {
      return 0;
    }
  
    return completedOrders.reduce((total, order) => {
      order.orderItems.forEach((orderItem) => {
        if (orderItem.productVariant.equals(this._id)) {
          total += orderItem.quantity * this.price;
        }
      });
      return total;
    }, 0);
  });
  
  productVariantSchema.virtual('quantitySold').get(function () {
    const currentDate = new Date();
    const timeframeMap = {
      '7d': currentDate.setDate(currentDate.getDate() - 7),
      '30d': currentDate.setDate(currentDate.getDate() - 30),
      '90d': currentDate.setDate(currentDate.getDate() - 90),
      '365d': currentDate.setDate(currentDate.getDate() - 365),
    };
  
    const timeframeDate = this.timeframeDate || timeframeMap['30d']; // Use '30d' as default if timeframeDate is not provided
    if (!this.completedOrders) {
        return 0;
    }
    // Filter completed orders within the specified timeframe
    const completedOrders = this.completedOrders.filter(
      (order) => order.createdAt >= timeframeDate
    );
  
    if (!completedOrders) {
      return 0;
    }
  
    return completedOrders.reduce((total, order) => {
      order.orderItems.forEach((orderItem) => {
        if (orderItem.productVariant.equals(this._id)) {
          total += orderItem.quantity;
        }
      });
      return total;
    }, 0);
  });
  
  productVariantSchema.virtual('addToCartCountWithinTimeframe').get(async function () {
    const currentDate = new Date();
    const timeframeMap = {
      '7d': currentDate.setDate(currentDate.getDate() - 7),
      '30d': currentDate.setDate(currentDate.getDate() - 30),
      '90d': currentDate.setDate(currentDate.getDate() - 90),
      '365d': currentDate.setDate(currentDate.getDate() - 365),
    };
  
    const timeframeDate = this.timeframeDate || timeframeMap['30d']; // Use '30d' as default if timeframeDate is not provided
  
    const addToCartCount = await mongoose
      .model('AddToCart')
      .countDocuments({ productVariant: this._id, createdAt: { $gte: timeframeDate } });
  
    return addToCartCount;
  });
  
  productVariantSchema.virtual('wishlistCountWithinTimeframe').get(async function () {
    const currentDate = new Date();
    const timeframeMap = {
      '7d': currentDate.setDate(currentDate.getDate() - 7),
      '30d': currentDate.setDate(currentDate.getDate() - 30),
      '90d': currentDate.setDate(currentDate.getDate() - 90),
      '365d': currentDate.setDate(currentDate.getDate() - 365),
    };
  
    const timeframeDate = this.timeframeDate || timeframeMap['30d']; // Use '30d' as default if timeframeDate is not provided
  
    const wishlistCount = await mongoose
      .model('Wishlist')
      .countDocuments({ productVariant: this._id, createdAt: { $gte: timeframeDate } });
  
    return wishlistCount;
  });


module.exports = mongoose.model('ProductVariant', productVariantSchema);
