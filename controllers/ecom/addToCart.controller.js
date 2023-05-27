const asyncHandler = require('express-async-handler');
const AddToCart = require('../../models/ecom/addToCart.model');

const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    const cart = new AddToCart({ userId, productId, quantity });
    await cart.save();

    res.json({ cart });
});

const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const userId = req.userId;

    // find and update status
    const cart = await AddToCart.find({ userId, productId });
    
    if (cart.length > 0) {
        cart[0].status = 'removed';
        await cart[0].save();
        res.json({ cart }); 
    } else {
        res.status(400).json({ error: 'Cart not found' });
    }
});

const getCart = asyncHandler(async (req, res) => {
    const userId = req.userId;
    
    const cart = await AddToCart.find({ userId, status: 'added' }).populate('productId');
    res.json({ cart });
});

module.exports = { addToCart, removeFromCart, getCart };