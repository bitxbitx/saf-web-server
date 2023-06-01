const express = require('express')
const router = express.Router()

const { protect } = require('../../middleware/auth.middleware')
const { getPromoCodes, getPromoCode, createPromoCode, updatePromoCode, deletePromoCode, } = require('../../controllers/ecom/promoCode.controller')


// Handle image upload
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    }
})

const fileFilter = (req, file, cb) => {
    // reject a file
    // Accepts jpeg, png, jpg, svg
    if ( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/svg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})


router.route('/').get(protect, getPromoCodes).post(protect, upload.single('image'), createPromoCode)
router.route('/:id').get(protect, getPromoCode).put(protect, upload.single('image'), updatePromoCode).delete(protect, deletePromoCode)

module.exports = router