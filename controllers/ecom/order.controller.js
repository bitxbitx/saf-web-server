const asyncHandler = require('express-async-handler');
const Order = require('../../models/ecom/order.model');
const Product = require('../../models/ecom/product.model');

const createOrder = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const order = new Order({ userId, ...req.body });
    await order.save();
    res.json({ order });
});

const getOrder = asyncHandler(async (req, res) => {
    Order.findById(req.params.id)
    .populate({
        path: 'orderItems.productVariant',
        model: 'ProductVariant',
        populate: {
            path: 'product',
            model: 'Product'
        }   
    })
    .populate('promoCodeUsed')
    .populate('customer')
    .exec((err, order) => {
        console.log(order);
        if (err) {
            // handle error
        }
        res.json({ order });
    });

});

const updateOrder = asyncHandler(async (req, res) => {
    const order = await Order.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).populate('customer').populate('promoCodeUsed');
    res.json({ order });
});

const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Order removed' });
});

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate({
        path: 'orderItems.productVariant',
        model: 'ProductVariant',
        populate: {
            path: 'product',
            model: 'Product'
        }   
    })
    .populate('promoCodeUsed')
    .populate('customer')
    .exec((err, orders) => {
        if (err) {
            // handle error
        }
        res.json({ orders });
    });
    // res.json({ orders });
});

const getOrdersByUser = asyncHandler(async (req, res) => {
    const orders = await Order.find({ customer: req.userId }).populate({
        path: 'orderItems.productVariant',
        model: 'ProductVariant',
        populate: {
            path: 'product',
            model: 'Product'
        }   
    })
    .populate('promoCodeUsed')
    .populate('customer')
    .exec((err, orders) => {
        if (err) {
            // handle error
        }
        res.json({ orders });
    });

});

module.exports = { createOrder, getOrder, updateOrder, deleteOrder, getOrders, getOrdersByUser };