const express = require('express')
const router = express.Router()
const { protect } = require('../../middleware/auth.middleware')
const { getLikes, getLike, createLike, updateLike, deleteLike, } = require('../../controllers/social/like.controller')

router.route('/').get(protect, getLikes).post(protect, createLike)
router.route('/:id').get(protect, getLike).put(protect, updateLike).delete(protect, deleteLike)

module.exports = router
