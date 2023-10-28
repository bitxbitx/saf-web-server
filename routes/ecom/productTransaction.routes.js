const express = require('express')
const router = express.Router()
const { protect } = require('../../middleware/auth.middleware')
const { 
  createProductTransaction,
  getProductTransactions,
  getProductTransactionById,
  updateProductTransaction,
  deleteProductTransaction,
  getTransactionsByProductId, } = require('../../controllers/ecom/productTransaction.controller')

router.route('/').get(protect, getProductTransactions).post(protect, createProductTransaction)
router.route('/:id').get(protect, getProductTransactionById).put(protect, updateProductTransaction).delete(protect, deleteProductTransaction)
router.route('/product/:id').get(protect, getTransactionsByProductId)

module.exports = router