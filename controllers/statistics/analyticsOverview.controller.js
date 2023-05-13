const asyncHandler = require('express-async-handler');
const Order = require('../../models/ecom/order.model');

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

  // Line chart: Sales 
  const salesLineChartData = {
      labels: orderAggregateData.map((data) => `${data._id.day}/${data._id.month}/${data._id.year}`),
      datasets: [
          {
              label: 'Sales',
              data: orderAggregateData.map((data) => data.totalAmount),
              fill: false,
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)',
          }
      ]
  };

  // Bar chart: Sales based on Price Point
  const pricePointBarChartData = {
      labels: orderAggregateData.map((data) => `${data._id.day}/${data._id.month}/${data._id.year}`),
      datasets: [
          {
              label: 'Sales',
              data: orderAggregateData.map((data) => data.totalAmount),
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
