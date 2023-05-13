const asyncHandler = require('express-async-handler');
const Order = require('../../models/ecom/order.model');
const Product = require('../../models/ecom/product.model');
const productVariant = require('../../models/ecom/productVariant.model');

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

    const orderAggregateData = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: new Date(timeFrameInMillisecondsAgo) }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                },
                totalAmount: { $sum: '$totalAmount' },
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                '_id.year': 1,
                '_id.month': 1,
                '_id.day': 1
            }
        }
    ]);

    const productAggregateData = await Product.aggregate([
        {
            $match: {
                category: productCategory
            }
        },
        {
            $lookup: {
                from: 'productvariants',
                localField: '_id',
                foreignField: 'product',
                as: 'productVariants'
            }
        },
        {
            $unwind: '$productVariants'
        },
        {
            $group: {
                _id: '$_id',
                name: { $first: '$name' },
                totalSales: { $sum: '$productVariants.totalSales' },
                totalOrders: { $sum: '$productVariants.totalOrders' },
                totalUnitsSold: { $sum: '$productVariants.totalUnitsSold' },
                totalUnitsInStock: { $sum: '$productVariants.totalUnitsInStock' },
                wishlistCount: { $sum: '$productVariants.wishlistCount' },
                addToCartCount: { $sum: '$productVariants.addToCartCount' }
            }
        },
        {
            $sort: {
                totalSales: -1
            }
        }
    ]);

    const productVariantAggregateData = await productVariant.aggregate([
        {
            $match: {
                product: { $in: productAggregateData.map(product => product._id) }
            }
        },
        {
            $group: {
                _id: '$product',
                variants: {
                    $push: {
                        _id: '$_id',
                        name: '$name',
                        totalSales: '$totalSales',
                        totalOrders: '$totalOrders',
                        totalUnitsSold: '$totalUnitsSold',
                        totalUnitsInStock: '$totalUnitsInStock',
                        wishlistCount: '$wishlistCount',
                        addToCartCount: '$addToCartCount'
                    }
                }
            }
        }
    ]);

    const productData = productAggregateData.map(product => {
        const productVariant = productVariantAggregateData.find(productVariant => productVariant._id.toString() === product._id.toString());
        return {
            ...product,
            variants: productVariant.variants
        }
    }
    );

    res.json({
        orderAggregateData,
        productData
    });

});

module.exports = {
    productInsights
}
