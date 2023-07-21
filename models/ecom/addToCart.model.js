const mongoose = require('mongoose');
/**
 * @swagger
 * components:
 *  schemas:
 *   AddToCart:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         description: AddToCart ID
 *         example: "611fda05f2d63e001bbcc7a1"
 *       user:
 *         type: string
 *         description: ID of the user associated with the cart item
 *         example: "611fda05f2d63e001bbcc7a1"
 *       product:
 *         type: string
 *         description: ID of the product associated with the cart item
 *         example: "611fda05f2d63e001bbcc7a1"
 *       productVariant:
 *         type: string
 *         description: ID of the product variant associated with the cart item
 *         example: "611fda05f2d63e001bbcc7a1"
 *       quantity:
 *         type: integer
 *         description: Quantity of the product in the cart
 *         example: 2
 *       status:
 *         type: string
 *         enum:
 *           - "added"
 *           - "purchased"
 *           - "removed"
 *         description: Status of the cart item
 *         example: "added"
 *     required:
 *       - user
 *       - product
 *       - productVariant
 *       - quantity
 *       - status
 */

const AddToCartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    productVariant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductVariant',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['added', 'purchased', 'removed'],
        default: 'added',
    },

},
    {
        timestamps: true,
    });

module.exports = mongoose.model('AddToCart', AddToCartSchema);
