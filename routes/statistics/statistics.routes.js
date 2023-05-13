const express = require('express')
const router = express.Router()
const { protect } = require('../../middleware/auth.middleware')
const { customerInsights } = require('../../controllers/statistics/customerInsights.controller')
const { productInsights } = require('../../controllers/statistics/productInsights.controller')
const { analyticsOverview } = require('../../controllers/statistics/analyticsOverview.controller')

router.route('/customer-insights').get(protect, customerInsights)
router.route('/product-insights').get(protect, productInsights)
router.route('/analytics-overview').get(protect, analyticsOverview)

module.exports = router