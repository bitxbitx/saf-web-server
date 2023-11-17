const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware');
const {
  createImageFile,
  getImageFiles,
  getImageFileById,
  updateImageFile,
  deleteImageFile,
} = require('../../controllers/social/imageFile.controller');

router.route('/').get(protect, getImageFiles).post(protect, createImageFile);
router
  .route('/:id')
  .get(protect, getImageFileById)
  .put(protect, updateImageFile)
  .delete(protect, deleteImageFile);

module.exports = router;