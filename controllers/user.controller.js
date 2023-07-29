// app/controllers/user.controller.js

const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * paths:
 *   /users/{id}:
 *     get:
 *       summary: Get a user by ID
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: User ID
 *       responses:
 *         '200':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *         '404':
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json({ user });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});
/**
 * @swagger
 * paths:
 *   /users/{id}:
 *     get:
 *       summary: Get a user by ID
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: User ID
 *       responses:
 *         '200':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *         '404':
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */
const updateUser = asyncHandler(async (req, res) => {
  try {
    if (req.file) {
      req.body.image = req.file.path;
    }

    // Hash password if it was sent in request body
    if (req.body.password) {
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(req.body.password, salt);
      console.log("Hashing password...");
      req.body.password = hash;
    }

    const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    });
    console.log(user);
    res.json({ user });
  } catch (error) {
    // Check if the error is a validation error
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors });
    }

    // If duplicate key error return a simple message
    if (error.code === 11000) {
      return res.status(400).json({ error: "User already exists" });
    }

    // If any other error return the full error
    res.status(500).json({ error: error.message });
  }
});
/**
 * @swagger
 * paths:
 *   /users/{id}:
 *     delete:
 *       summary: Delete a user by ID
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: User ID
 *       responses:
 *         '200':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *         '404':
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOneAndDelete({ _id: req.params.id });
  res.json({ message: "User removed" });
});
/**
 * @swagger
 * paths:
 *   /users:
 *     get:
 *       summary: Get all users
 *       tags: [Users]
 *       responses:
 *         '200':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   users:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/User'
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json({ users });
});
/**
 * @swagger
 * paths:
 *   /users:
 *     post:
 *       summary: Create a new user
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       responses:
 *         '200':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *         '400':
 *           description: Bad request - validation error or duplicate key error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 */

const createUser = asyncHandler(async (req, res) => {
  try {
    // Handle image upload
    if (req.file) {
      req.body.image = req.file.path;
    }
    const user = new User({ ...req.body });
    await user.save();
    res.json({ user });
  } catch (error) {
    // Check if the error is a validation error
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors });
    }

    // If duplicate key error return a simple message
    if (error.code === 11000) {
      return res.status(400).json({ error: "User already exists" });
    }

    // If any other error return the full error
    res.status(500).json({ error: error.message });
  }
});

module.exports = { getUser, updateUser, deleteUser, getUsers, createUser };
