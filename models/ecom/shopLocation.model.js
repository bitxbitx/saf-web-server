const mongoose = require('mongoose');

const ShopLocationSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name value']
        },
        longitude: {
            type: Number,
            required: [true, 'Please add a longitude value']
        },
        latitude: {
            type: Number,
            required: [true, 'Please add a latitude value']
        },
        address: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        email: {
            type: String,
        },
        openingHours: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('ShopLocation', ShopLocationSchema)
