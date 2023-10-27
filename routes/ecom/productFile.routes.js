const express = require('express')
const router = express.Router()
const { protect } = require('../../middleware/auth.middleware')
const { getProductFiles, getProductFileById, createProductFile, updateProductFile, deleteProductFile, getProductFilesByCollectionId } = require('../../controllers/ecom/productFile.controller')

router.route('/').get(protect, getProductFiles).post(protect, createProductFile)
router.route('/:id').get(protect, getProductFileById).put(protect, updateProductFile).delete(protect, deleteProductFile)
router.route('/collection/:id').get(protect, getProductFilesByCollectionId)

module.exports = router
