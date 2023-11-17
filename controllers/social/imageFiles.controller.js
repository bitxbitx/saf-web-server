const asyncHandler = require('express-async-handler');
const ImageFile = require('../../../models/social/imageFiles.model');

const createImageFile = asyncHandler(async (req, res) => {
    try {
        console.log('Inside createImageFile: ', req.body);
        const file = new ImageFile(req.body);
        const createdFile = await file.save();
        res.status(201).json(createdFile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const getImageFiles = asyncHandler(async (req, res) => {
    try {
        const files = await ImageFile.find();
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const getImageFileById = asyncHandler(async (req, res) => {
    try {
        const file = await ImageFile.findById(req.params.id);
        if (file) {
            res.json(file);
        } else {
            res.status(404).json({ message: 'File not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const updateImageFile = asyncHandler(async (req, res) => {
    try {
        const file = await ImageFile.findById(req.params.id);
        if (file) {
            const updatedFile = await ImageFile.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updatedFile);
        } else {
            res.status(404).json({ message: 'File not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const deleteImageFile = asyncHandler(async (req, res) => {
    try {
        const file = await ImageFile.findById(req.params.id);
        if (file) {
            await file.remove();
            res.json({ message: 'File removed' });
        } else {
            res.status(404).json({ message: 'File not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = {
    createImageFile,
    getImageFiles,
    getImageFileById,
    updateImageFile,
    deleteImageFile,
};
