const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Post ID
 *           example: "611fda05f2d63e001bbcc7a1"
 *         platform:
 *           type: string
 *           enum:
 *             - "Facebook"
 *             - "Shopee"
 *             - "Instagram"
 *             - "Lazada"
 *             - "Twitter"
 *           description: Platform on which the post was made
 *           example: "Facebook"
 *         arrangement:
 *           type: number
 *           description: Arrangement of the post
 *           example: 1
 *         publishDate:
 *           type: string
 *           format: date-time
 *           description: Date and time the post is scheduled to be published
 *           example: "2023-07-26T12:00:00.000Z"
 *         status:
 *           type: string
 *           enum:
 *             - "Draft"
 *             - "Scheduled"
 *             - "Published"
 *           description: Status of the post (Draft, Scheduled, Published)
 *           example: "Draft"
 *         caption:
 *           type: string
 *           description: Caption or content of the post
 *           example: "Check out our latest products!"
 *         medias:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of media URLs associated with the post (if any)
 *           example:
 *             - "https://example.com/images/post1.jpg"
 *             - "https://example.com/videos/post1.mp4"
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: Array of comments associated with the post
 *         likes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Like'
 *           description: Array of likes associated with the post
 *         share:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Share'
 *           description: Array of shares associated with the post
 *       required:
 *         - platform
 *         - arrangement
 *         - publishDate
 *         - status
 *         - caption
 *     example:
 *       _id: "611fda05f2d63e001bbcc7a1"
 *       platform: "Facebook"
 *       arrangement: 1
 *       publishDate: "2023-07-26T12:00:00.000Z"
 *       status: "Draft"
 *       caption: "Check out our latest products!"
 *       medias:
 *         - "https://example.com/images/post1.jpg"
 *         - "https://example.com/videos/post1.mp4"
 *       comments: []
 *       likes: []
 *       share: []
 */
const PostSchema = new mongoose.Schema(
  {
    name:{
      type: String,
    },
    platform: {
      type: String,
      enum: ["facebook", "shopee", "instagram", "lazada", "twitter", "ownApp"],
    },
    arrangement: {
      type: Number,
    },
    publishDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Draft", "Scheduled", "Published"],
      default: "Draft",
    },
    caption: {
      type: String,
    },
    season: {
      type: String,
    },
    selectedMedias: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

PostSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

PostSchema.virtual("share", {
  ref: "Share",
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

module.exports = mongoose.model("Post", PostSchema);
