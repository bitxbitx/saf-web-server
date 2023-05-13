const express = require('express')
const router = express.Router()
const { protect } = require('../../middleware/auth.middleware')
const { getShares, getShare, createShare, updateShare, deleteShare, } = require('../../controllers/social/share.controller')

router.route('/').get(protect, getShares).post(protect, createShare)
router.route('/:id').get(protect, getShare).put(protect, updateShare).delete(protect, deleteShare)

module.exports = router 
