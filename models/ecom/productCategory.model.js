const mongoose = require('mongoose');
const Schema = mongoose.Schema

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