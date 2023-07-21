const mongoose = require('mongoose');
const Schema = mongoose.Schema

/**
 * @swagger
 * components:
 *  schemas:
 *   ProductCategory:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         description: ProductCategory ID
 *         example: "611fda05f2d63e001bbcc7a1"
 *       name:
 *         type: string
 *         description: Name of the product category
 *         example: "Electronics"
 *       description:
 *         type: string
 *         description: Description of the product category
 *         example: "Electronic products and accessories."
 *       image:
 *         type: string
 *         description: URL of the image associated with the product category
 *         example: "https://example.com/images/electronics.jpg"
 *     required:
 *       - name
 *     # Add other required properties if applicable
 */
const productCategorySchema = Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name for this catergory"]
        },
        description: {
            type: String,
            default: ""
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("ProductCategory", productCategorySchema)