const asyncHandler = require("express-async-handler");
const ProductCollection = require("../../models/ecom/productCollection.model");
const Product = require("../../models/ecom/product.model");

const createProductCollection = asyncHandler(async (req, res) => {
  try {
    // Handle file uploads
    if (req.files) {
      const files = req.files.map((file) => {
        return file.path;
      });
      req.body.medias = files;
    }

    console.log("req.body", req.body);

    const collection = new ProductCollection(req.body);
    const createdCollection = await collection.save();
    res.status(201).json(createdCollection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getProductCollections = asyncHandler(async (req, res) => {
  try {
    const collections = await ProductCollection.find();
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getProductCollectionById = asyncHandler(async (req, res) => {
  try {
    const collection = await ProductCollection.findById(req.params.id);
    if (collection) {
      res.json(collection);
    } else {
      res.status(404).json({ message: "Collection not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateProductCollection = asyncHandler(async (req, res) => {
  try {
    const collection = await ProductCollection.findById(req.params.id);
    if (collection) {
      // Handle file uploads
      if (req.files) {
        const files = req.files.map((file) => {
          return file.path;
        });
        req.body.medias = files;
      }

      const updatedCollection = await ProductCollection.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedCollection);
    } else {
      res.status(404).json({ message: "Collection not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const deleteProductCollection = asyncHandler(async (req, res) => {
  try {
    const collection = await ProductCollection.findById(req.params.id);
    if (collection) {
      await collection.remove();
      res.json({ message: "Collection removed" });
    } else {
      res.status(404).json({ message: "Collection not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createProductCollection,
  getProductCollections,
  getProductCollectionById,
  updateProductCollection,
  deleteProductCollection,
};

