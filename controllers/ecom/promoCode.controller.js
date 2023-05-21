const asyncHandler = require('express-async-handler');
const PromoCode = require('../../models/ecom/promoCode.model');
const ProductCategory = require('../../models/ecom/productCategory.model');

const createPromoCode = asyncHandler(async (req, res) => {
    const promoCode = new PromoCode(req.body);
    await promoCode.save();
    console.log(promoCode);

    const brofkthisshit = await PromoCode.findById(promoCode._id.toString()).populate('productCategory');
    
    res.json({ promoCode:brofkthisshit});
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
    console.log(req.body);
    const promoCode = await PromoCode.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).populate('productCategory');
    console.log(promoCode);
    res.json({ promoCode });
});

const deletePromoCode = asyncHandler(async (req, res) => {
    const promoCode = await PromoCode.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Promo code removed' });
});

module.exports = { createPromoCode, getPromoCodes, getPromoCode, updatePromoCode, deletePromoCode };