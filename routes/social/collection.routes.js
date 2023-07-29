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
    cb(null, uuid.v4());
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
