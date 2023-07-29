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
    const collections = await Collection.find();
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
const updateCollection = asyncHandler(async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (collection) {
      collection.title = req.body.title || collection.title;
      collection.medias = req.body.medias || collection.medias;

      console.log("req.body.posts", req.body.posts);

      // Check if there are new posts
      if (req.body.posts) {
        // Check if there is _id field in the posts
        const newPosts = req.body.posts.filter((post) => !post._id);

        console.log("newPosts", newPosts);

        if (newPosts.length > 0) {
          // Assuming you have a separate Post model defined (replace 'Post' with your actual model name)
          const createdPosts = await Post.create(newPosts);

          // Add the IDs of the newly created posts to the collection's 'posts' field
          collection.posts.push(...createdPosts.map((post) => post._id));
        }
      }

      const updatedCollection = await collection.save();
      res.json(updatedCollection);
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
