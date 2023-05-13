const express = require('express')
const router = express.Router()
const { protect } = require('../../middleware/auth.middleware')
const { getShopLocations, getShopLocation, createShopLocation, updateShopLocation, deleteShopLocation, } = require('../../controllers/ecom/shopLocation.controller')

router.route('/').get(protect, getShopLocations).post(protect, createShopLocation)
router.route('/:id').get(protect, getShopLocation).put(protect, updateShopLocation).delete(protect, deleteShopLocation)

module.exports = router
