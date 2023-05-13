const asyncHandler = require('express-async-handler');
const Post = require('../../models/social/post.model');

const createPost = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const post = new Post({ userId, ...req.body });
    await post.save();
    res.json({ post });
});

const getPost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('comments');
    res.json({ post });
});

const updatePost = asyncHandler(async (req, res) => {
    const post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    res.json({ post });
});

const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Post removed' });
});

const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({}).populate('comments');
    res.json({ posts });
});

module.exports = { createPost, getPost, updatePost, deletePost, getPosts };