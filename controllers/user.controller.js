const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json({ user });
});

const updateUser = asyncHandler(async (req, res) => {
    try {
        if (req.file) { req.body.image = req.file.path }
        
        // Hash password if it was sent in request body
        if (req.body.password) {
          const salt = await bcrypt.genSalt(12)
            const hash = await bcrypt.hash(req.body.password, salt)
            console.log("Hashing password...")
            req.body.password = hash
        }

        const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })                
        console.log(user)
        res.json({ user });
    } catch (error) {
        // Check if the error is a validation error
        if (error instanceof mongoose.Error.ValidationError) {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ error: errors });
        }

        // If duplicate key error return a simple message
        if (error.code === 11000) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // If any other error return the full error
        res.status(500).json({ error: error.message });
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    res.json({ message: 'User removed' });
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json({ users });
});

const createUser = asyncHandler(async (req, res) => {
    try {
      // Handle image upload
      if (req.file) { req.body.image = req.file.path }
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
        return res.status(400).json({ error: 'User already exists' });
      }
  
      // If any other error return the full error
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = { getUser, updateUser, deleteUser, getUsers, createUser };