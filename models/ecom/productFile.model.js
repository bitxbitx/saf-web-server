const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductFileSchema = new Schema({
  title: {
    type: String,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  season: {
    type: String,
  },
  festival: {
    type: String,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});


module.exports = mongoose.model("ProductFile", ProductFileSchema);
