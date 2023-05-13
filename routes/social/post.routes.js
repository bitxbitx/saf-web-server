const express = require('express')
const router = express.Router()
const { protect } = require('../../middleware/auth.middleware')
const { getPosts, getPost, createPost, updatePost, deletePost, } = require('../../controllers/social/post.controller')

router.route('/').get(protect, getPosts).post(protect, createPost)
router.route('/:id').get(protect, getPost).put(protect, updatePost).delete(protect, deletePost)

module.exports = router