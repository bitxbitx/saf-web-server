const asyncHandler = require('express-async-handler');
const Product = require('../../models/ecom/product.model');
const ProductVariant = require('../../models/ecom/productVariant.model');


const createProduct = asyncHandler(async (req, res) => {
    if (req.file) { req.body.image = req.file.path }
    // Change string to json for productCategory
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
    if (req.file) { req.body.image = req.file.path }
    // Change string to json for productCategory
    req.body.productCategory = JSON.parse(req.body.productCategory);

    // Extract only the _id
    req.body.productCategory = req.body.productCategory.map((item) => item._id);

    const product = await Product.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    res.json({ product });
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Product removed' });
});

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct };