const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = Schema(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderItems: [{
            productVariant: {
                type: Schema.Types.ObjectId,
                ref: "ProductVariant",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        }],
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'cancelled'],
            default: 'pending',
        },
        promoCodeUsed: {
            type: Schema.Types.ObjectId,
            ref: "PromoCode"
        },


    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Order', orderSchema)