const asyncHandler = require('express-async-handler');
const Product = require('../../models/ecom/product.model');
const ProductTransaction = require('../../models/ecom/productTransaction.model');
require('dotenv').config();

const createProduct = asyncHandler(async (req, res) => {
  try {
    console.log('Inside createProduct: ', req.body);
    // const imagePaths = [];

    // if (req.images && req.images.length > 0) {
    //   req.images.forEach((file) => {
    //     imagePaths.images(file.path);
    //   });
    // }

    // req.body.images = imagePaths.map(path => process.env.SERVER_URL + 'api/' + path);
    // Split the color and size strings into arrays
    const colors = req.body.color.split(',');
    const sizes = req.body.size.split(',');

    // Generate all combinations of color and size
    const combinations = [];
    for (const color of colors) {
        for (const size of sizes) {
            combinations.push({ color, size, stock: 0 });
        }
    }

    req.body.stockMapping = req.body.stockMapping || [];

    // Add the combinations to stockMapping
    for (const combination of combinations) {
        const { color, size } = combination;

        // Check if the combination already exists in stockMapping
        const combinationExists = req.body.stockMapping.some(entry => entry.color === color && entry.size === size);

        if (!combinationExists) {
          req.body.stockMapping.push(combination);
        }
    }

    const product = new Product(req.body);
    await product.save();

    // Create a ProductTransaction for the opening stock for each color ( sample data: 'S, M, L' )
    const productTransactionsPromises = colors.forEach(async color => {
      const productTransaction = new ProductTransaction({
        product: product._id,
        type: 'Opening',
        stockCode: product.stockCode,
        articleNumber: product.articleNumber,
        color: color,
        price: product.price,
        opening: 0,
        inStock: 0,
        return: 0,
        sizeStockMap: sizes.map(size => ({ size, stock: 0 })),
      });
      await productTransaction.save();
    });

    await Promise.all(productTransactionsPromises);

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    // Updating Product
    if (typeof req.body.images === 'string') { req.body.images = JSON.parse(req.body.images) }

    const imagePaths = req.body.images || [];

    if (req.files && req.files.length > 0) {
      // Iterate through each uploaded file
      req.files.forEach((file) => {
        imagePaths.push(process.env.SERVER_URL + 'api/' + file.path);
      });
    }

    req.body.images = imagePaths

    // Split the color and size strings into arrays
    const colors = req.body.color.split(',');
    const sizes = req.body.size.split(',');

    // Generate all combinations of color and size
    const combinations = [];
    for (const color of colors) {
        for (const size of sizes) {
            combinations.push({ color, size, stock: 0 });
        }
    }

    req.body.stockMapping = req.body.stockMapping || [];

    // Add the combinations to stockMapping
    for (const combination of combinations) {
        const { color, size } = combination;

        // Check if the combination already exists in stockMapping
        const combinationExists = req.body.stockMapping.some(entry => entry.color === color && entry.size === size);

        if (!combinationExists) {
          req.body.stockMapping.push(combination);
        }
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }

});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};