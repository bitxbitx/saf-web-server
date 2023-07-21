const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *   Wishlist:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         description: Wishlist ID
 *         example: "611fda05f2d63e001bbcc7a1"
 *       user:
 *         type: string
 *         description: ID of the user who created the wishlist
 *         example: "611fda05f2d63e001bbcc7a1"
 *       product:
 *         type: string
 *         description: ID of the product added to the wishlist
 *         example: "611fda05f2d63e001bbcc7a1"
 *     required:
 *       - user
 *       - product
 *     # Add other required properties if applicable
 */
const WishlistSchema = new mongoose.Schema({
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
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);

