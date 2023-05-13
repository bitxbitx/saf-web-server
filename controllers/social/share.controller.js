const asyncHandler = require('express-async-handler');
const Share = require('../../models/social/share.model');

const createShare = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const share = new Share({ userId, ...req.body });
    await share.save();
    res.json({ share });
});

const getShare = asyncHandler(async (req, res) => {
    const share = await Share.findById(req.params.id);
    res.json({ share });
});

const updateShare = asyncHandler(async (req, res) => {
    const share = await Share.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    res.json({ share });
});

const deleteShare = asyncHandler(async (req, res) => {
    const share = await Share.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'Share removed' });
});

const getShares = asyncHandler(async (req, res) => {
    const shares = await Share.find({});
    res.json({ shares });
});

module.exports = { createShare, getShare, updateShare, deleteShare, getShares };
