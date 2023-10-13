const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth.middleware");
const {
  getProductCollectionById,
  getProductCollections,
  createProductCollection,
  updateProductCollection,
  deleteProductCollection,
} = require("../../controllers/ecom/productCollection.controller");

const multer = require("multer");
const uuid = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/productCollections");
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
  .get(protect, getProductCollections)
  .post(protect, upload.array("medias"), createProductCollection);
router
  .route("/:id")
  .get(protect, getProductCollectionById)
  .put(protect, upload.array("medias"), updateProductCollection)
  .delete(protect, deleteProductCollection);

module.exports = router;
