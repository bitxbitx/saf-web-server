const express = require('express')
const router = express.Router()
const { protect } = require('../../middleware/auth.middleware')
const { getComments, getComment, createComment, updateComment, deleteComment, } = require('../../controllers/social/comment.controller')

router.route('/').get(protect, getComments).post(protect, createComment)
router.route('/:id').get(protect, getComment).put(protect, updateComment).delete(protect, deleteComment)

module.exports = router