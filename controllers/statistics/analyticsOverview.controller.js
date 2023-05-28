const asyncHandler = require('express-async-handler');
const Order = require('../../models/ecom/order.model');
const ProductVariant = require('../../models/ecom/productVariant.model');


const analyticsOverview = asyncHandler(async (req, res) => {
    /**
     * Generate statistics data to display on the front end
     * 
     * Line chart: Sales
     * Bar chart: Sales based on Price Point
     * Bar chart: Number of Orders / Transactions
     * 
     * All chart data should take into account the time frame specified by the user
     */

    const { timeFrame } = req.query; // eg. 7d, 30d, 90d, 365d, all

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
                totalAmount: { $sum: '$totalPrice' },
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

    // Fetch all Product Variants
    const productVariants = await ProductVariant.find({}).populate('completedOrders');

    // Loop through each product variant to create a data point for the price point bar chart
    let pricePointBarChartDatasets = [];
    productVariants.map((productVariant) => {
        const pricePoint = productVariant.price;
        const timeframeDate = new Date(timeFrameInMillisecondsAgo);
        productVariant.timeframeDate = timeframeDate;
        const sales = productVariant.sales;
        // Check if price point already exists in the array
        const pricePointExists = pricePointBarChartDatasets.find((data) => data.pricePoint === pricePoint);
        if (pricePointExists) {
            // If price point already exists, add the sales to the existing data point
            pricePointExists.sales += sales;
        }
        else {
            // If price point does not exist, create a new data point
            pricePointBarChartDatasets.push({
                pricePoint,
                sales
            });
        }
    });

    // Line chart: Sales 
    const salesLineChartData = {
        labels: orderAggregateData.map((data) => `${data._id.day}/${data._id.month}/${data._id.year}`),
        datasets: [
            {
                label: 'Sales',
                data: orderAggregateData.map((data) => data.totalAmount / 100),
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
            }
        ]
    };

    // Bar chart: Sales based on Price Point
    const pricePointBarChartData = {
        labels: pricePointBarChartDatasets.map((data) => 'MYR ' + data.pricePoint),
        datasets: [
            {
                label: 'Sales',
                data: pricePointBarChartDatasets.map((data) => data.sales),
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            }
        ]
    };



    // Bar chart: Number of Orders / Transactions
    const numberOfOrdersBarChartData = {
        labels: orderAggregateData.map((data) => `${data._id.day}/${data._id.month}/${data._id.year}`),
        datasets: [
            {
                label: 'Number of Orders',
                data: orderAggregateData.map((data) => data.count),
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            }
        ]
    };
    res.json({
        salesLineChartData,
        pricePointBarChartData,
        numberOfOrdersBarChartData
    });
});

module.exports = {
    analyticsOverview
}
