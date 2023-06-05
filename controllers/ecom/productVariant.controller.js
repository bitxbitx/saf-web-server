const asyncHandler = require('express-async-handler');
const Product = require('../../models/ecom/product.model');
const ProductVariant = require('../../models/ecom/productVariant.model');

const createProductVariant = asyncHandler(async (req, res) => {
    console.log("req.body", req.body)

    // Change string to json for attributes
    if (req.body.attributes && typeof req.body.attributes == 'string') { req.body.attributes = JSON.parse(req.body.attributes) }

    const productVariant = new ProductVariant(req.body);
    await productVariant.save();
    res.json({ productVariant });
});

const getProductVariants = asyncHandler(async (req, res) => {
    const productVariants = await ProductVariant.find({});
    res.json({ productVariants });
});

const getProductVariant = asyncHandler(async (req, res) => {
    const productVariant = await ProductVariant.findById(req.params.id);
    res.json({ productVariant });
});


const updateProductVariant = asyncHandler(async (req, res) => {
    console.log("req.body", req.body)

    // Change string to json for attributes
    if ( typeof req.body.attributes === 'string' )
    req.body.attributes = JSON.parse(req.body.attributes);

    const productVariant = await ProductVariant.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json({ productVariant });
});

const deleteProductVariant = asyncHandler(async (req, res) => {
    const productVariant = await ProductVariant.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Product variant removed' });
});

const getProductVariantByProduct = asyncHandler(async (req, res) => {
    const productVariant = await ProductVariant.find({ product: req.params.id });
    res.json({ productVariant });
});

module.exports = { createProductVariant, getProductVariants, getProductVariant, updateProductVariant, deleteProductVariant, getProductVariantByProduct };