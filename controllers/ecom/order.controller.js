const asyncHandler = require('express-async-handler');
const Order = require('../../models/ecom/order.model');

const createOrder = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const order = new Order({ userId, ...req.body });
    await order.save();
    res.json({ order });
});

const getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.json({ order });
});

const updateOrder = asyncHandler(async (req, res) => {
    const order = await Order.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    res.json({ order });
});

const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Order removed' });
});

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({});
    res.json({ orders });
});

module.exports = { createOrder, getOrder, updateOrder, deleteOrder, getOrders };