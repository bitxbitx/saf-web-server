const mongoose = require('mongoose')

/**
 * @swagger
 * components:
 *  schemas:
 *   Notification:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         description: Notification ID
 *         example: "611fda05f2d63e001bbcc7a1"
 *       customer:
 *         type: string
 *         description: ID of the customer receiving the notification
 *         example: "611fda05f2d63e001bbcc7a1"
 *       message:
 *         type: string
 *         description: Content of the notification message
 *         example: "You have a new order."
 *       isRead:
 *         type: boolean
 *         description: Indicates whether the notification has been read or not
 *         example: false
 *     required:
 *       - customer
 *       - message
 *     # Add other required properties if applicable
 */
const NotificationSchema = mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Notification', NotificationSchema)