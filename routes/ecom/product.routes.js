const express = require('express')
const router = express.Router()
const { protect } = require('../../middleware/auth.middleware')
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
  } = require('../../controllers/ecom/product.controller')

// Handle Image Upload
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
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/svg') {
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
});


router.route('/').get(protect, getProducts).post(protect, upload.array('images'), createProduct)
router.route('/:id').get(protect, getProductById).put(protect, upload.array('images'), updateProduct).delete(protect, deleteProduct)

module.exports = router