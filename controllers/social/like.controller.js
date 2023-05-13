const asyncHandler = require('express-async-handler');
const Like = require('../../models/social/like.model');

const createLike = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const like = new Like({ userId, ...req.body });
    await like.save();
    res.json({ like });
});

const getLike = asyncHandler(async (req, res) => {
    const like = await Like.findById(req.params.id);
    res.json({ like });
});

const updateLike = asyncHandler(async (req, res) => {
    const like = await Like.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    res.json({ like });
});

const deleteLike = asyncHandler(async (req, res) => {
    const like = await Like.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Like removed' });
});

const getLikes = asyncHandler(async (req, res) => {
    const likes = await Like.find({});
    res.json({ likes });
});

module.exports = { createLike, getLike, updateLike, deleteLike, getLikes };