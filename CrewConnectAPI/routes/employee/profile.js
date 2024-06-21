const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const { jwtkey } = require('../../keys');
const requireToken = require('../../middleware/requireToken');
const router = express.Router();
const multer = require('multer');
const User = mongoose.model('User');
const Admin = mongoose.model('Admin');
const Leave = mongoose.model('Leave');
const sharp = require('sharp');
const cloudinary = require('../../helper/imageUpload')

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  console.log(file)
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('invalid image file!', false);
  }
};
const uploads = multer({ storage, fileFilter });


router.post('/upload-profile', requireToken, uploads.single('profile'), async (req, res) => {
  // const { user } = req.user._id;
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, message: 'unauthorized access!' });

  try {
    console.log("inside try")
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${req.user._id}_profile`,
      width: 500,
      height: 500,
      crop: 'fill',
    });

    console.log(result)

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { Avatar: result.url },
      { new: true }
    );
    res
      .status(201)
      .json({ success: true, message: 'Your profile has updated!' });
  } catch (error) {
    if (error.message) {
      console.error('Error while uploading profile image:', error.message);
    } else {
      console.error('Error while uploading profile image:', error);
    }
    res.status(500).json({ success: false, message: 'server error, try after some time' });
  }
});


router.post('/fetch-profile-photo', requireToken, async (req, res) => {
  try {
   

    if (!req.user.Avatar) {
      return res.status(404).json({ message: 'Avatar not found for this user' });
    }
    res.json({ avatar: req.user.Avatar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;

