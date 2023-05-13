const asyncHandler = require('express-async-handler');
const ShopLocation = require('../../models/ecom/shopLocation.model');

const createShopLocation = asyncHandler(async (req, res) => {
    const shopLocation = new ShopLocation(req.body);
    await shopLocation.save();
    res.json({ shopLocation });
});

const getShopLocations = asyncHandler(async (req, res) => {
    const shopLocations = await ShopLocation.find({});
    res.json({ shopLocations });
});

const getShopLocation = asyncHandler(async (req, res) => {
    const shopLocation = await ShopLocation.findById(req.params.id);
    res.json({ shopLocation });
});

const updateShopLocation = asyncHandler(async (req, res) => {
    const shopLocation = await ShopLocation.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    console.log(shopLocation)
    res.json({ shopLocation });
});

const deleteShopLocation = asyncHandler(async (req, res) => {
    const shopLocation = await ShopLocation.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Shop location removed' });
});

module.exports = { createShopLocation, getShopLocations, getShopLocation, updateShopLocation, deleteShopLocation };