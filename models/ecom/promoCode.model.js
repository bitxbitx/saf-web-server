const mongoose = require('mongoose')
const Schema = mongoose.Schema

// TODO : Add required messages
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