const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * @swagger
 * components:
 *  schemas:
 *   OrderItem:
 *     type: object
 *     properties:
 *       productVariant:
 *         type: string
 *         description: ID of the product variant associated with the order item
 *         example: "611fda05f2d63e001bbcc7a1"
 *       quantity:
 *         type: integer
 *         description: Quantity of the product variant in the order item
 *         example: 2
 *     required:
 *       - productVariant
 *       - quantity
 *
 *   Order:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         description: Order ID
 *         example: "611fda05f2d63e001bbcc7a1"
 *       customer:
 *         type: string
 *         description: ID of the customer who placed the order
 *         example: "611fda05f2d63e001bbcc7a1"
 *       orderItems:
 *         type: array
 *         description: List of order items included in the order
 *         items:
 *           $ref: '#/components/schemas/OrderItem'
 *       totalPrice:
 *         type: number
 *         description: Total price of the order
 *         example: 100.0
 *       status:
 *         type: string
 *         enum:
 *           - "pending"
 *           - "processing"
 *           - "completed"
 *           - "cancelled"
 *         description: Status of the order
 *         example: "pending"
 *       promoCodeUsed:
 *         type: string
 *         description: ID of the promo code used in the order (if applicable)
 *         example: "611fda05f2d63e001bbcc7a1"
 *     required:
 *       - customer
 *       - orderItems
 *       - totalPrice
 *       - status
 */
const orderSchema = Schema(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderItems: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        }],
        color: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
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