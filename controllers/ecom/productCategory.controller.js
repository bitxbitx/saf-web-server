const asyncHandler = require('express-async-handler');
const ProductCategory = require('../../models/ecom/productCategory.model');

const createProductCategory = asyncHandler(async (req, res) => {
    // Handle image upload
    if (req.file) { req.body.image = req.file.path }
    const productCategory = new ProductCategory( {...req.body });
    await productCategory.save();
    res.json({ productCategory });
});

const getProductCategories = asyncHandler(async (req, res) => {
    const productCategories = await ProductCategory.find({});
    res.json({ productCategories });
});

const getProductCategory = asyncHandler(async (req, res) => {
    const productCategory = await ProductCategory.findById(req.params.id);
    res.json({ productCategory });
});

const updateProductCategory = asyncHandler(async (req, res) => {
    // Handle image upload
    if (req.file) { req.body.image = req.file.path }
    const productCategory = await ProductCategory.findOneAndUpdate(
        { _id: req.params.id }, 
        {...req.body },
         { new: true }
         );
    res.json({ productCategory });
});

const deleteProductCategory = asyncHandler(async (req, res) => {
    const productCategory = await ProductCategory.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Product category removed' });
});

module.exports = { createProductCategory, getProductCategories, getProductCategory, updateProductCategory, deleteProductCategory };