const express = require('express')
const router = express.Router()

const { protect } = require('../../middleware/auth.middleware')
const { getPromoCodes, getPromoCode, createPromoCode, updatePromoCode, deletePromoCode, } = require('../../controllers/ecom/promoCode.controller')

router.route('/').get(protect, getPromoCodes).post(protect, createPromoCode)
router.route('/:id').get(protect, getPromoCode).put(protect, updatePromoCode).delete(protect, deletePromoCode)

module.exports = router