const asyncHandler = require('express-async-handler');
const PromoCode = require('../../models/ecom/promoCode.model');
const ProductCategory = require('../../models/ecom/productCategory.model');

const createPromoCode = asyncHandler(async (req, res) => {
    // console.log(req.body);
    if (req.file) { req.body.image = process.env.SERVER_URL + '/api/' +  req.file.path }

    // Change string to JSON for productCategory
    req.body.productCategory = JSON.parse(req.body.productCategory);

    // Extract only the _id
    req.body.productCategory = req.body.productCategory.map((item) => item._id);

    const promoCode = new PromoCode(req.body);
    await promoCode.save();

    const brofkthisshit = await PromoCode.findById(promoCode._id.toString()).populate('productCategory');

    res.json({ promoCode: brofkthisshit });
});

const getPromoCodes = asyncHandler(async (req, res) => {
    const promoCodes = await PromoCode.find({}).populate('productCategory');
    res.json({ promoCodes });
});

const getPromoCode = asyncHandler(async (req, res) => {
    const promoCode = await PromoCode.findById(req.params.id).populate('productCategory');
    res.json({ promoCode });
});

const updatePromoCode = asyncHandler(async (req, res) => {
    // console.log(req.body);
    if (req.file) { req.body.image = process.env.SERVER_URL +  '/api/' + req.file.path }

    // Change string to JSON for productCategory
    req.body.productCategory = JSON.parse(req.body.productCategory);

    // Extract only the _id
    req.body.productCategory = req.body.productCategory.map((item) => item._id);
    const promoCode = await PromoCode.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).populate('productCategory');
    res.json({ promoCode });
});

const deletePromoCode = asyncHandler(async (req, res) => {
    const promoCode = await PromoCode.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Promo code removed' });
});

module.exports = { createPromoCode, getPromoCodes, getPromoCode, updatePromoCode, deletePromoCode };