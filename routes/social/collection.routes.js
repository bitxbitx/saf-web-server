const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth.middleware");
const {
  getCollectionById,
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} = require("../../controllers/social/collection.controller");
const multer = require("multer");
const uuid = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/collections");
  },
  filename: function (req, file, cb) {
    // Get the file extension
    const fileExtension = file.originalname.split('.').pop();
    
    // Generate a UUID for the file name without spaces
    const fileNameWithoutSpaces = uuid.v4().replace(/-/g, '');

    // Combine the UUID and the file extension
    const finalFileName = fileNameWithoutSpaces + '.' + fileExtension;

    cb(null, finalFileName);
  },
});

const upload = multer({ storage: storage });

router
  .route("/")
  .get(protect, getCollections)
  .post(protect, upload.array("medias"), createCollection);
router
  .route("/:id")
  .get(protect, getCollectionById)
  .put(protect, upload.array("medias"), updateCollection)
  .delete(protect, deleteCollection);

module.exports = router;
