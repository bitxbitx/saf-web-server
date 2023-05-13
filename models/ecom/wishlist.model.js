const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    required: true,
  },
  status: {
    type: String,
    enum: ['added', 'removed'],
    default: 'added',
  },
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);

