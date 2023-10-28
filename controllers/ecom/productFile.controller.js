const asyncHandler = require("express-async-handler");
const ProductFile = require("../../models/ecom/productFile.model");
const ProductCollection = require("../../models/ecom/productCollection.model");

const createProductFile = asyncHandler(async (req, res) => {
  try {
    console.log("Inside createProductFile: ", req.body)
    const file = new ProductFile(req.body);
    const createdFile = await file.save();
    res.status(201).json(createdFile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
);

const getProductFiles = asyncHandler(async (req, res) => {
  try {
    const files = await ProductFile.find().populate('products');
    res.json(files);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}
);

const getProductFileById = asyncHandler(async (req, res) => {
  try {
    const file = await ProductFile.findById(req.params.id).populate('products');
    if (file) {
      res.json(file);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
);

const updateProductFile = asyncHandler(async (req, res) => {
  try {
    const file = await ProductFile.findById(req.params.id);
    if (file) {
      const updatedFile = await ProductFile.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedFile);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
);

const deleteProductFile = asyncHandler(async (req, res) => {
  try {
    const file = await ProductFile.findById(req.params.id);
    if (file) {
      await file.remove();
      res.json({ message: "File removed" });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
);

const getProductFilesByCollectionId = asyncHandler(async (req, res) => {
  try {
    const productCollection = await ProductCollection.findById(req.params.id).populate({
      path: "files",
      populate: {
        path: "products",
        model: "Product"
      }
    });
    if (productCollection) {
      res.json({ files: productCollection.files });
    } else {
      res.status(404).json({ message: "Collection not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
);

module.exports = {
  createProductFile,
  getProductFiles,
  getProductFileById,
  updateProductFile,
  deleteProductFile,
  getProductFilesByCollectionId
};