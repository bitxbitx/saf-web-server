const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Collection:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Collection ID
 *           example: "611fda05f2d63e001bbcc7a1"
 *         title:
 *           type: string
 *           description: Collection title
 *           example: "Vacation Memories"
 *         medias:
 *           type: array
 *           items:
 *             type: string
 *           description: List of media URLs associated with the collection
 *           example:
 *             - "https://example.com/images/photo1.jpg"
 *             - "https://example.com/images/photo2.jpg"
 *             - "https://example.com/videos/video1.mp4"
 *         posts:
 *           type: array
 *           items:
 *             type: string
 *           description: List of Post IDs associated with the collection
 *           example:
 *             - "611fda05f2d63e001bbcc7a1"
 *             - "611fda05f2d63e001bbcc7a2"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Collection creation timestamp
 *           example: "2023-07-26T12:34:56.789Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Collection update timestamp
 *           example: "2023-07-26T12:34:56.789Z"
 *         photo_count:
 *           type: integer
 *           description: Count of photos in the collection
 *           example: 2
 *         video_count:
 *           type: integer
 *           description: Count of videos in the collection
 *           example: 1
 *       example:
 *         _id: "611fda05f2d63e001bbcc7a1"
 *         title: "Vacation Memories"
 *         medias:
 *           - "https://example.com/images/photo1.jpg"
 *           - "https://example.com/images/photo2.jpg"
 *           - "https://example.com/videos/video1.mp4"
 *         posts:
 *           - "611fda05f2d63e001bbcc7a1"
 *           - "611fda05f2d63e001bbcc7a2"
 *         createdAt: "2023-07-26T12:34:56.789Z"
 *         updatedAt: "2023-07-26T12:34:56.789Z"
 *         photo_count: 2
 *         video_count: 1
 */
const CollectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    medias: [
      {
        type: String,
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    captionedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CollectionSchema.virtual("photo_count").get(function () {
  // Loop through to check the extension of each media
  let count = 0;
  for (let i = 0; i < this.medias.length; i++) {
    const media = this.medias[i];
    const extension = media.split(".").pop();
    if (extension === "jpg" || extension === "png" || extension === "jpeg" || extension === "gif" || extension === "webp" || extension === "bmp") {
      count++;
    }
  }
  return count; // Return the computed count value
});

CollectionSchema.virtual("video_count").get(function () {
  // Loop through to check the extension of each media
  let count = 0;
  for (let i = 0; i < this.medias.length; i++) {
    const media = this.medias[i];
    const extension = media.split(".").pop();
    if (extension === "mp4") {
      count++;
    }
  }
  return count; // Return the computed count value
});

// Auto populate the posts field, photo_count and video_count, and remove __v
CollectionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "posts",
    select: "-__v",
  })
  .populate({
    path: "captionedPosts",
    select: "-__v",
  });
  next();
});

module.exports = mongoose.model("Collection", CollectionSchema);
