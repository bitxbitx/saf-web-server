const mongoose = require('mongoose');
const { Schema } = mongoose;

const productTransactionSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: true,
        },
        stockNumber: {
            type: Number,
            required: [true, 'Please add a stock number'],
        },
        articleNumber: {
            type: String,
            required: [true, 'Please add an article number'],
        },
        color: {
            type: String,
            required: [true, 'Please add a color'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
        },
        opening: Number,
        inStock: Number,
        return: Number,
        sizeStockMap: [{
            size: String,
            stock: Number,
        }], 
        orderNumber: {
            type: mongoose.Schema.ObjectId,
            ref: 'Order',
        },

    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

productTransactionSchema.virtual('balance').get(function () {
    // Loop through sizeStockMap and add up the stock
    return this.sizeStockMap.reduce((acc, sizeStock) => {
        return acc + sizeStock.stock;
    }, 0);
});

module.exports = mongoose.model('ProductTransaction', productTransactionSchema);