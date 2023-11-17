const asyncHandler = require("express-async-handler");
const Collection = require("../../models/social/collection.model");
const Post = require("../../models/social/post.model");

/**
 * @swagger
 * tags:
 *   name: Collections
 *   description: API endpoints for managing collections
 */

/**
 * @swagger
 * /api/collections:
 *   post:
 *     summary: Create a new collection
 *     tags: [Collections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Collection'
 *     responses:
 *       '201':
 *         description: Collection created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
const createCollection = asyncHandler(async (req, res) => {
  try {
    // Handle file uploads
    if (req.files) {
      const files = req.files.map((file) => {
        return file.path;
      });
      req.body.medias = files;
    }

    console.log("req.body", req.body);

    const collection = new Collection(req.body);
    const createdCollection = await collection.save();
    res.status(201).json(createdCollection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/collections:
 *   get:
 *     summary: Get all collections
 *     tags: [Collections]
 *     responses:
 *       '200':
 *         description: Collections retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Collection'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */

const getCollections = asyncHandler(async (req, res) => {
  try {
    const collections = await Collection.find()
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/collections/{id}:
 *   get:
 *     summary: Get a collection by ID
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Collection ID
 *     responses:
 *       '200':
 *         description: Collection found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *       '404':
 *         description: Collection not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */

const getCollectionById = asyncHandler(async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (collection) {
      res.json(collection);
    } else {
      res.status(404).json({ message: "Collection not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * @swagger
 * /api/collections/{id}:
 *   put:
 *     summary: Update a collection by ID
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Collection ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Collection Title"
 *               medias:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - "https://example.com/images/photo1.jpg"
 *                   - "https://example.com/images/photo2.jpg"
 *               posts:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - "611fda05f2d63e001bbcc7a1"
 *                   - "611fda05f2d63e001bbcc7a2"
 *     responses:
 *       '200':
 *         description: Collection updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 *       '404':
 *         description: Collection not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
// const updateCollection = asyncHandler(async (req, res) => {
//   try {
//     const collection = await Collection.findById(req.params.id);
//     if (collection) {
//       collection.title = req.body.title || collection.title;
//       collection.medias = req.body.medias || collection.medias;
//       collection.captionedPosts = req.body.captionedPosts || collection.captionedPosts;

//       // Check if there are new posts
//       if (req.body.posts) {
//         // Separate new posts from existing posts
//         const newPosts = req.body.posts.filter((post) => !post._id);
//         const existingPosts = req.body.posts.filter((post) => post._id);

//         // Create new posts
//         if (newPosts.length > 0) {
//           const createdPosts = await Post.create(newPosts);
//           collection.posts.push(...createdPosts.map((post) => post._id));
//         }

//         // Update existing posts
//         if (existingPosts.length > 0) {
//           for (let post of existingPosts) {
//             await Post.findByIdAndUpdate(post._id, post, { new: true });
//           }
//         }
//       }

//       // Check if there are new captioned posts
//       if (req.body.captionedPosts) {
//         // Separate new captioned posts from existing captioned posts
//         const newCaptionedPosts = req.body.captionedPosts.filter((post) => !post._id);
//         const existingCaptionedPosts = req.body.captionedPosts.filter((post) => post._id);

//         // Create new captioned posts
//         if (newCaptionedPosts.length > 0) {
//           const createdCaptionedPosts = await Post.create(newCaptionedPosts);
//           collection.captionedPosts.push(...createdCaptionedPosts.map((post) => post._id));
//         }

//         // Update existing captioned posts
//         if (existingCaptionedPosts.length > 0) {
//           for (let post of existingCaptionedPosts) {
//             await Post.findByIdAndUpdate(post._id, post, { new: true });
//           }
//         }
//       }

//       const updatedCollection = await collection.save();
//       res.json(updatedCollection);
//     } else {
//       res.status(404).json({ message: "Collection not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

const updateCollection = asyncHandler(async (req, res) => {
  try {
    console.log("req.body.completedPosts", req.body.completedPosts);
    const collection = await Collection.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    res.json(collection);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/collections/{id}:
 *   delete:
 *     summary: Delete a collection by ID
 *     tags: [Collections]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Collection ID
 *     responses:
 *       '200':
 *         description: Collection deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       '404':
 *         description: Collection not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */

const deleteCollection = asyncHandler(async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (collection) {
      await collection.remove();
      res.json({ message: "Collection removed" });
    } else {
      res.status(404).json({ message: "Collection not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
};
