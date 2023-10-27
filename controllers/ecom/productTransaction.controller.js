const asyncHandler = require("express-async-handler");
const ProductTransaction = require("../../models/ecom/productTransaction.model");
const Product = require("../../models/ecom/product.model");
const Order = require("../../models/ecom/order.model");

const createProductTransaction = asyncHandler(async (req, res) => {
  try {
    const transaction = new ProductTransaction(req.body);
    const createdTransaction = await transaction.save();
    res.status(201).json(createdTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
);

const getProductTransactions = asyncHandler(async (req, res) => {
  try {
    const transactions = await ProductTransaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
);

const getProductTransactionById = asyncHandler(async (req, res) => {
  try {
    const transaction = await ProductTransaction.findById(req.params.id);
    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateProductTransaction = asyncHandler(async (req, res) => {
  try {
    const transaction = await ProductTransaction.findById(req.params.id);
    if (transaction) {
      const updatedTransaction = await ProductTransaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedTransaction);
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
);

const deleteProductTransaction = asyncHandler(async (req, res) => {
  try {
    const transaction = await ProductTransaction.findById(req.params.id);
    if (transaction) {
      await transaction.remove();
      res.json({ message: "Transaction removed" });
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
);

const getTransactionsByProductId = asyncHandler(async (req, res) => {
  try {
    const transactions = await ProductTransaction.find({ product: req.params.id });
    if (transactions){
      res.status(200).json(transactions);
    } else {
      res.status(404).json({ message: "Transactions not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createProductTransaction,
  getProductTransactions,
  getProductTransactionById,
  updateProductTransaction,
  deleteProductTransaction,
  getTransactionsByProductId,
};
