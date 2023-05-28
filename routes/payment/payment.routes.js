const express = require('express')
const router = express.Router()
const { protect } = require('../../middleware/auth.middleware')
const { stripePayEndpointMethodId,  stripePayEndpointIntentId } = require('../../controllers/payment/payment.controller')

// router.route('/create-payment-intent').post(protect, createPaymentIntent)
router.route('/pay-method-id').post(protect, stripePayEndpointMethodId)
router.route('/pay-intent-id').post(protect, stripePayEndpointIntentId)

module.exports = router