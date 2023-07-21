// app/routes/user.route.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/user.controller');
// Handle image upload
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  // Accepts jpeg, png, jpg, svg
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/svg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


router.route('/')
  .get(protect, getUsers)
  .post(protect, upload.single('image'), createUser);

router.route('/:id')
  .get(protect, getUser)
  .put(protect, upload.single('image'), updateUser)
  .delete(protect, deleteUser);

module.exports = router;
