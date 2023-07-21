const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *   ShopLocation:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         description: ShopLocation ID
 *         example: "611fda05f2d63e001bbcc7a1"
 *       name:
 *         type: string
 *         description: Name of the shop location
 *         example: "Example Shop"
 *       longitude:
 *         type: number
 *         description: Longitude of the shop location
 *         example: -122.084
 *       latitude:
 *         type: number
 *         description: Latitude of the shop location
 *         example: 37.421
 *       address:
 *         type: string
 *         description: Address of the shop location
 *         example: "123 Main Street"
 *       phoneNumber:
 *         type: string
 *         description: Phone number of the shop location
 *         example: "1234567890"
 *       email:
 *         type: string
 *         description: Email of the shop location
 *         example: "shop@example.com"
 *       openingHours:
 *         type: string
 *         description: Opening hours of the shop location
 *         example: "Mon-Sat: 9 AM - 6 PM"
 *     required:
 *       - name
 *       - longitude
 *       - latitude
 *     # Add other required properties if applicable
 */
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
