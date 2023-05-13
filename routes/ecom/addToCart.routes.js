const express = require('express')
const router = express.Router()
const { protect } = require('../../middleware/auth.middleware')
const { addToCart, removeFromCart, getCart } = require('../../controllers/ecom/addToCart.controller')

router.route('/:id').get(protect, getCart).post(protect, addToCart).delete(protect, removeFromCart)

module.exports = router