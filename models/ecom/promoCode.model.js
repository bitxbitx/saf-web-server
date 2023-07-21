const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * @swagger
 * components:
 *  schemas:
 *   PromoCode:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         description: PromoCode ID
 *         example: "611fda05f2d63e001bbcc7a1"
 *       code:
 *         type: string
 *         description: Code for the promo code
 *         example: "SUMMER50"
 *       discountAmount:
 *         type: number
 *         description: Discount amount for the promo code
 *         example: 10
 *       startDate:
 *         type: string
 *         format: date
 *         description: Start date of the promo code
 *         example: "2023-07-01"
 *       endDate:
 *         type: string
 *         format: date
 *         description: End date of the promo code
 *         example: "2023-07-15"
 *       status:
 *         type: string
 *         enum:
 *           - "active"
 *           - "inactive"
 *         description: Status of the promo code (active or inactive)
 *         example: "active"
 *       discountType:
 *         type: string
 *         enum:
 *           - "percentage"
 *           - "fixed"
 *         description: Type of the promo code discount (percentage or fixed)
 *         example: "percentage"
 *       productCategory:
 *         type: array
 *         items:
 *           type: string
 *           description: ID of the product category associated with the promo code
 *           example: "611fda05f2d63e001bbcc7a1"
 *       maxNumebrOfUses:
 *         type: number
 *         description: Maximum number of uses for the promo code
 *         example: 100
 *       description:
 *         type: string
 *         description: Description of the promo code
 *         example: "Get 50% off on all products"
 *       minPurchaseAmount:
 *         type: number
 *         description: Minimum purchase amount required to use the promo code
 *         example: 50
 *       maxDiscountAmount:
 *         type: number
 *         description: Maximum discount amount applicable for the promo code
 *         example: 20
 *       maxUsesPerUser:
 *         type: number
 *         description: Maximum number of times a user can use the promo code
 *         example: 1
 *       image:
 *         type: string
 *         description: URL of the image associated with the promo code
 *         example: "https://example.com/images/summer_sale.jpg"
 *       numberOfUses:
 *         type: number
 *         description: Number of times the promo code has been used
 *         example: 50
 *     required:
 *       - code
 *       - discountAmount
 *       - startDate
 *       - status
 *       - discountType
 *     # Add other required properties if applicable
 */
const promoCodeSchema = Schema(
    {
        code: {
            type: String,
            required: [true, 'Please add a code for this promo code'],
        },
        discountAmount: {
            type: Number,
            required: [true, 'Please add a discount amount for this promo code'],
        },
        startDate: {
            type: Date,
            required: [true, 'Please add a start date for this promo code']
        },
        endDate: Date,
        status: {
            type: String,
            required: [true, 'Please add a status for this promo code'],
            enum: ['active', 'inactive']
        },
        discountType: {
            type: String,
            required: [true, 'Please add a type for this promo code'],
            enum: ['percentage', 'fixed']
        },
        productCategory: [{
            type: Schema.Types.ObjectId,
            ref: "ProductCategory"
        }],
        maxNumebrOfUses: Number,
        description: String,
        minPurchaseAmount: Number,
        maxDiscountAmount: Number,
        maxUsesPerUser: Number,
        image: String,
    },
    {
        timestamps: true,
        toJson: { virtuals: true },
        toObject: { virtuals: true },
    }
)

promoCodeSchema.virtual('numberOfUses', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'promoCode',
    count: true
})

promoCodeSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'productCategory',
    }).populate({
        path: 'numberOfUses',
    })

    if (this.numberOfUses > this.maxNumebrOfUses) {
        this.status = 'inactive'
    }

    next()
})

module.exports = mongoose.model("PromoCode", promoCodeSchema)