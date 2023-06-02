const asyncHandler = require('express-async-handler');
const Wishlist = require('../../models/ecom/wishlist.model');

const createWishlist = asyncHandler(async (req, res) => {
    const user = req.userId;
    const wishlist = new Wishlist({ user, ...req.body });
    await wishlist.save();
    res.json({ wishlist });
});

const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findById(req.params.id);
    res.json({ wishlist });
});

const updateWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    res.json({ wishlist });
});

const deleteWishlist = asyncHandler(async (req, res) => {
    const { product } = req.body;
    const wishlist = await Wishlist.findOneAndDelete({ user: req.params.id, product });
    res.json({ message: 'Wishlist removed' });
});

const getWishlists = asyncHandler(async (req, res) => {
    const wishlists = await Wishlist.find({});
    res.json({ wishlists });
});

const getWishlistByUser = asyncHandler(async (req, res) => {
    const wishlists = await Wishlist.find({ user: req.params.id }).populate({
        path: 'product',
        model: 'Product',
        populate: {
            path: 'productVariant',
            model: 'productVariant'
        }
    })
    console.log("Wishlists: ", wishlists)
    res.json({ wishlists });
});

module.exports = { createWishlist, getWishlist, updateWishlist, deleteWishlist, getWishlists, getWishlistByUser };