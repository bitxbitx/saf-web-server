const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth.middleware')
const { login, register, getMe, forgotPassword, resetPassword, updateDetails, logout, refreshTokens } = require('../controllers/auth.controller')

router.route('/login').post(login)
router.route('/register').post(register)
router.route('/me').get(protect, getMe)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:resettoken').put(resetPassword)
router.route('/update-details').put(protect, updateDetails)
router.route('/logout').get(protect, logout)
router.route('/refresh-token').post( refreshTokens )

module.exports = router