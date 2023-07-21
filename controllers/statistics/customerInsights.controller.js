const asyncHandler = require('express-async-handler');
const User = require('../../models/user.model');
const Order = require('../../models/ecom/order.model');
/**
 * @swagger
 * tags:
 *   name: Ecommerce - Analytics
 *   description: Ecommerce customer insights
 * components:
 *   schemas:
 *     CustomerInsightsResponse:
 *       type: object
 *       properties:
 *         newVsReturningCustomers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: "New"
 *               count:
 *                 type: number
 *                 example: 100
 *           example:
 *             - _id: "New"
 *               count: 100
 *             - _id: "Returning"
 *               count: 50
 *         customerAgeDistribution:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: "0-10"
 *               count:
 *                 type: number
 *                 example: 20
 *           example:
 *             - _id: "0-10"
 *               count: 20
 *             - _id: "11-20"
 *               count: 30
 *         ethnicityDistribution:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: "Chinese"
 *               count:
 *                 type: number
 *                 example: 50
 *           example:
 *             - _id: "Chinese"
 *               count: 50
 *             - _id: "Malay"
 *               count: 30
 */

/**
 * @swagger
 * /api/ecom/customer-insights:
 *   get:
 *     summary: Get customer insights data
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
 *         description: Time frame for the customer insights data
 *     responses:
 *       '200':
 *         description: Customer insights data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerInsightsResponse'
 *       '500':
 *         description: Internal server error
 */

const customerInsights = asyncHandler(async (req, res) => {
    /**
     * Generate statistics data to display on the front end
     * 
     * Pie chart: New vs Returning Customers by number of customers
     * 
     * Bar chart: Customer Age Distribution (0-10, 11-20, 21-30, 31-40, 41-50, 51-60, 61+)
     * 
     * Pie chart: Ethnicity Distribution
     */

    const { timeFrame } = req.query; // eg. 7d, 30d, 90d, 365d, all
    console.log(timeFrame);

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



    const newVsReturningCustomers = await User.aggregate([
        {
            $lookup: {
                from: "orders",
                localField: "_id",
                foreignField: "user",
                as: "orders"
            }
        },
        {
            $match: {
                "orders.createdAt": { $gte: new Date(timeFrameInMillisecondsAgo) }
            }
        },
        {
            $group: {
                _id: {
                    $cond: [
                        { $gte: [{ $size: "$orders" }, 1] },
                        "Returning",
                        "New"
                    ]
                },
                count: { $sum: 1 }
            }
        }
    ]);

    const customerAgeDistribution = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(timeFrameInMillisecondsAgo) }
          }
        },
        {
          $project: {
            age: {
              $floor: {
                $divide: [
                  { $subtract: [new Date(), "$dob"] },
                  31536000000
                ]
              }
            }
          }
        },
        {
          $project: {
            age: 1,
            ageRange: {
              $switch: {
                branches: [
                  { case: { $lte: ["$age", 10] }, then: "0-10" },
                  { case: { $lte: ["$age", 20] }, then: "11-20" },
                  { case: { $lte: ["$age", 30] }, then: "21-30" },
                  { case: { $lte: ["$age", 40] }, then: "31-40" },
                  { case: { $lte: ["$age", 50] }, then: "41-50" },
                  { case: { $lte: ["$age", 60] }, then: "51-60" },
                ],
                default: "61+"
              }
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: "$ageRange",
            count: { $sum: 1 }
          }
        }
      ]);
      

      

    const ethnicityDistribution = await User.aggregate([
        {
            $match: {
                createdAt: { $gte: new Date(timeFrameInMillisecondsAgo) }
            }
        },
        {
            $group: {
                _id: {
                    $cond: [
                        { $eq: ["$ethnicity", "Chinese"] },
                        "Chinese",
                        {
                            $cond: [
                                { $eq: ["$ethnicity", "Malay"] },
                                "Malay",
                                {
                                    $cond: [
                                        { $eq: ["$ethnicity", "Indian"] },
                                        "Indian",
                                        {
                                            $cond: [
                                                { $eq: ["$ethnicity", "White"] },
                                                "White",
                                                {
                                                    $cond: [
                                                        { $eq: ["$ethnicity", "Others"] },
                                                        "Others",
                                                        "Unknown"
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                count: { $sum: 1 }
            }
        }
    ]);

    res.json({ newVsReturningCustomers, customerAgeDistribution, ethnicityDistribution });

});

module.exports = { customerInsights };