const asyncHandler = require('express-async-handler');
const Order = require('../../models/ecom/order.model');
const Product = require('../../models/ecom/product.model');
const ProductVariant = require('../../models/ecom/productVariant.model');
/**
 * @swagger
 * tags:
 *   name: Ecommerce - Analytics
 *   description: Ecommerce product insights
 * components:
 *   schemas:
 *     ProductInsightsResponse:
 *       type: object
 *       properties:
 *         productData:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "product_id"                  
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               totalSales:
 *                 type: number
 *                 example: 5000
 *               totalNumberOfOrders:
 *                 type: number
 *                 example: 50
 *               totalNumberOfUnitsSold:
 *                 type: number
 *                 example: 200
 *               totalNumberOfUnitsInStock:
 *                 type: number
 *                 example: 300
 *               sellThroughRate:
 *                 type: number
 *                 example: 0.67
 *               wishlistCount:
 *                 type: number
 *                 example: 10
 *               addToCartCount:
 *                 type: number
 *                 example: 20
 *           example:
 *             - product:
 *                 _id: "product_id_1"
 *               category: "Electronics"
 *               totalSales: 5000
 *               totalNumberOfOrders: 50
 *               totalNumberOfUnitsSold: 200
 *               totalNumberOfUnitsInStock: 300
 *               sellThroughRate: 0.67
 *               wishlistCount: 10
 *               addToCartCount: 20
 *             - product:
 *                 _id: "product_id_2"
 *               category: "Clothing"
 *               totalSales: 3000
 *               totalNumberOfOrders: 30
 *               totalNumberOfUnitsSold: 150
 *               totalNumberOfUnitsInStock: 200
 *               sellThroughRate: 0.75
 *               wishlistCount: 5
 *               addToCartCount: 15
 */

/**
 * @swagger
 * /api/ecom/product-insights:
 *   get:
 *     summary: Get product insights data
 *     tags: [Ecommerce - Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: timeFrame
 *         schema:
 *           type: string
 *           example: "7d"
 *           enum: ["7d", "30d", "90d", "365d", "all"]
 *         required: true
 *         description: Time frame for the product insights data
 *       - in: query
 *         name: productCategory
 *         schema:
 *           type: string
 *           example: "Electronics"
 *         required: true
 *         description: Product category for filtering the products
 *     responses:
 *       '200':
 *         description: Product insights data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductInsightsResponse'
 *       '500':
 *         description: Internal server error
 */
const productInsights = asyncHandler(async (req, res) => {
  /**
   * Generate statistics data to display on the front end
   * 
   * frontend would work with react-chartjs-2 or fl_chart
   * 
   * frontend would send a query string with the time frame and the product category
   * 
   * we need to generate a list of products that belong to the product category with the following stats:
   * - total sales
   * - total number of orders
   * - total number of units sold
   * - total number of units in stock
   * - sell through rate (units sold / units in stock + units sold)
   * - wishlist count
   * - add to cart count
   */

  const { timeFrame, productCategory } = req.query; // eg. 7d, 30d, 90d, 365d, all

  const getTimeFrameInMillisecondsAgo = (timeFrame) => {
    switch (timeFrame) {
      case '7d':
        return 7 * 24 * 60 * 60 * 1000;
      case '30d':
        return 30 * 24 * 60 * 60 * 1000;
      case '90d':
        return 90 * 24 * 60 * 60 * 1000;
      case '365d':
        return 365 * 24 * 60 * 60 * 1000;
      case 'all':
        return 0;
      default:
        throw new Error('Invalid time frame');
    }
  }

  const timeFrameInMillisecondsAgo = getTimeFrameInMillisecondsAgo(timeFrame);

  console.log(`Fetching data for the last ${timeFrame}...`);

  // Fetch all products that belong to the product category
  const products = await Product.find().populate({
    path: 'productVariant',
    populate: { path: 'completedOrders' }

  }).populate('wishlistCount');
  const timeframeDate = new Date(timeFrameInMillisecondsAgo);
  const productData = await Promise.all(products.map(async (product) => {
    const productVariantIds = product.productVariant.map((productVariant) => productVariant._id);
    const productVariantData = await ProductVariant.find({ _id: { $in: productVariantIds } }).populate('completedOrders');

    const totalSales = productVariantData.reduce((accumulator, productVariant) => {
      return accumulator + productVariant.completedOrders.reduce((accumulator, completedOrder) => {
        if (completedOrder.createdAt >= timeframeDate) {
          return accumulator + completedOrder.totalPrice;
        } else {
          return accumulator;
        }
      }, 0);
    }, 0);

    const totalNumberOfOrders = productVariantData.reduce((accumulator, productVariant) => {
      return accumulator + productVariant.completedOrders.reduce((accumulator, completedOrder) => {
        if (completedOrder.createdAt >= timeframeDate) {
          return accumulator + 1;
        } else {
          return accumulator;
        }
      }, 0);
    }, 0);

    const totalNumberOfUnitsSold = productVariantData.reduce((accumulator, productVariant) => {
      return accumulator + productVariant.completedOrders.reduce((accumulator, completedOrder) => {
        if (completedOrder.createdAt >= timeframeDate) {
          return accumulator + completedOrder.orderItems.reduce((accumulator, orderItem) => {
            if (orderItem.productVariant._id.toString() === productVariant._id.toString()) {
              return accumulator + orderItem.quantity;
            } else {
              return accumulator;
            }
          }, 0);
        } else {
          return accumulator;
        }
      }, 0);
    }, 0);

    const totalNumberOfUnitsInStock = productVariantData.reduce((accumulator, productVariant) => {
      return accumulator + productVariant.stock;
    }, 0);

    const sellThroughRate = Number.parseFloat(totalNumberOfUnitsSold / (totalNumberOfUnitsInStock + totalNumberOfUnitsSold)).toFixed(2);

    const wishlistCount = product.wishlistCount;

    let addToCartCount = 0;
    for (const productVariant of productVariantData) {
      productVariant.timeframeDate = timeframeDate;
      const temp = await productVariant.addToCartCountWithinTimeframe;
      addToCartCount += temp;
    }


    return {
      product: product,
      category: product.productCategory,
      totalSales,
      totalNumberOfOrders,
      totalNumberOfUnitsSold,
      totalNumberOfUnitsInStock,
      sellThroughRate,
      wishlistCount,
      addToCartCount
    };
  }));

  console.log(productData);

  res.json({
    productData
  });

});

module.exports = {
  productInsights
}
