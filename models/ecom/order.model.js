const mongoose = require('mongoose')
const Schema = mongoose.Schema

// TODO: Add required messages
// TODO: Add enum for status
// TODO: Add enum for paymentMethod
// TODO: Add enum for shippingMethod
// TODO: Add enum for shippingStatus
// TODO: FINILIZE THIS MODEL

const orderSchema = Schema(
    {
        customer:{
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        orderItems: [{
            type: Schema.Types.ObjectId,
            ref: "ProductVariant",
            required: true,
        }],
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        paymentMethod: {
            type: String,
        },
        promoCodeUsed:{
            type: Schema.Types.ObjectId,
            ref: "PromoCode"
        },
        shippingAddress: {
            type: String,
        },
        shippingCost: {
            type: Number,
        },
        shippingMethod: {
            type: String,
        },
        shippingStatus: {
            type: String,
        },

    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Order', orderSchema)