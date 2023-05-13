const asyncHandler = require('express-async-handler');
const PromoCode = require('../../models/ecom/promoCode.model');
const ProductCategory = require('../../models/ecom/productCategory.model');

const createPromoCode = asyncHandler(async (req, res) => {
    const promoCode = new PromoCode(req.body);
    await promoCode.save();
    res.json({ promoCode });
});

const getPromoCodes = asyncHandler(async (req, res) => {
    const promoCodes = await PromoCode.find({});
    res.json({ promoCodes });
});

const getPromoCode = asyncHandler(async (req, res) => {
    const promoCode = await PromoCode.findById(req.params.id);
    res.json({ promoCode });
});

const updatePromoCode = asyncHandler(async (req, res) => {
    
    const promoCode = await PromoCode.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    res.json({ promoCode });
});

const deletePromoCode = asyncHandler(async (req, res) => {
    const promoCode = await PromoCode.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Promo code removed' });
});

module.exports = { createPromoCode, getPromoCodes, getPromoCode, updatePromoCode, deletePromoCode };