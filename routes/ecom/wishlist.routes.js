const express = require('express')
const router = express.Router()
const { protect } = require('../../middleware/auth.middleware')
const { getWishlists, getWishlist, createWishlist, updateWishlist, deleteWishlist, getWishlistByUser } = require('../../controllers/ecom/wishlist.controller')

router.route('/').get(protect, getWishlists).post(protect, createWishlist)
router.route('/:id').get(protect, getWishlistByUser).put(protect, updateWishlist).delete(protect, deleteWishlist)

module.exports = router