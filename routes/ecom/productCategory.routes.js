const express = require('express')
const router = express.Router()
const { protect } = require('../../middleware/auth.middleware')
const { getProductCategories, getProductCategory, createProductCategory, updateProductCategory, deleteProductCategory, } = require('../../controllers/ecom/productCategory.controller')

// Handle image upload
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
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

router.route('/').get(protect, getProductCategories).post(protect, upload.single('image'), createProductCategory)
router.route('/:id').get(protect, getProductCategory).put(protect, upload.single('image'), updateProductCategory).delete(protect, deleteProductCategory)

module.exports = router