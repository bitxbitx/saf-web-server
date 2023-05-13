const asyncHandler = require('express-async-handler');
const Comment = require('../../models/social/comment.model');

const createComment = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const comment = new Comment({ userId, ...req.body });
    await comment.save();
    res.json({ comment });
});

const getComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    res.json({ comment });
});

const updateComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findOneAndUpdate({_id:req.params.id}, req.body, {new: true})
    res.json({ comment });
});

const deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Comment removed' });
});

const getComments = asyncHandler(async (req, res) => {
    const comments = await Comment.find({});
    res.json({ comments });
});

module.exports = { createComment, getComment, updateComment, deleteComment, getComments };