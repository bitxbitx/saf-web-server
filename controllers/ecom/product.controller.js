const asyncHandler = require('express-async-handler');
const Product = require('../../models/ecom/product.model');
const ProductVariant = require('../../models/ecom/productVariant.model');
require('dotenv').config();

const createProduct = asyncHandler(async (req, res) => {
    const imagePaths = [];
    // Check if any files were uploaded
    if (req.files && req.files.length > 0) {
      // Iterate through each uploaded file
      req.files.forEach((file) => {
        imagePaths.push(process.env.SERVER_URL + file.path);
      });
    }
  
    // Assign the array of image paths to the req.body.images property
    req.body.images = imagePaths;
  
    // Change string to JSON for productCategory
    req.body.productCategory = JSON.parse(req.body.productCategory);
  
    // Extract only the _id
    req.body.productCategory = req.body.productCategory.map((item) => item._id);
  
    const product = new Product(req.body);
    await product.save();
    res.json({ product });
  });

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).populate('productVariant').populate('productCategory');
    console.log(products)
    res.json({ products });
});

const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('productVariant').populate('productCategory');
    res.json({ product });
});

const updateProduct = asyncHandler(async (req, res) => {
    
    const imagePaths = req.body.images || [];
    // Check if any files were uploaded
    if (req.files && req.files.length > 0) {
      // Iterate through each uploaded file
      req.files.forEach((file) => {
        imagePaths.push(process.env.SERVER_URL + file.path);
      });
    }

  
    // Assign the array of image paths to the req.body.images property
    req.body.images = imagePaths;
  
    // Change string to JSON for productCategory
    req.body.productCategory = JSON.parse(req.body.productCategory);
  
    // Extract only the _id
    req.body.productCategory = req.body.productCategory.map((item) => item._id);

    const product = await Product.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    res.json({ product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id });
  await ProductVariant.deleteMany({ product: req.params.id }); // delete all product variants related to the product being deleted
  res.json({ message: 'Product removed' });
});

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct };