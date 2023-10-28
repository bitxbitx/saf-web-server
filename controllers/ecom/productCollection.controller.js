const asyncHandler = require("express-async-handler");
const ProductCollection = require("../../models/ecom/productCollection.model");

const createProductCollection = asyncHandler(async (req, res) => {
  try {
    console.log("Inside createProductCollection: ", req.body)
    const collection = new ProductCollection(req.body);
    const createdCollection = await collection.save();
    res.status(201).json(createdCollection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
);

const getProductCollections = asyncHandler(async (req, res) => {
  try {
    const collections = await ProductCollection.find().populate({
      path: "files", // Change this path to "productFile" to populate the productFile field of ProductCollection
      populate: {
        path: "products", // Populate the products array within the productFile
        model: "Product" // Adjust the model to match your schema for the products
      }
    });
    res.json(collections);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
);

const getProductCollectionById = asyncHandler(async (req, res) => {
  try {
    const collection = await ProductCollection.findById(req.params.id).populate({
      path: "files", // Change this path to "productFile" to populate the productFile field of ProductCollection
      populate: {
        path: "products", // Populate the products array within the productFile
        model: "Product" // Adjust the model to match your schema for the products
      }
    });
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
}
);

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
}
);

module.exports = {
  createProductCollection,
  getProductCollections,
  getProductCollectionById,
  updateProductCollection,
  deleteProductCollection
};