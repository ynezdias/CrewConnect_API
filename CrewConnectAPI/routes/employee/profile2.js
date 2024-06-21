
const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = mongoose.model('User');
const router = express.Router();
const requireToken = require('../../middleware/requireToken');
const path = require('path');
const { readlink } = require('fs/promises');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const fs = require('fs');

let gfs;
const hostname = "https://15bd-150-107-99-114.ngrok-free.app"
// const {mongoUrl}=require('./keys') 
const conn = mongoose.createConnection(process.env.MONGO_URI);

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
  console.log("conn triggred")
});

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + `_${req.user.id}` + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// @route POST /avatar
// @desc  Uploads PROFILE PHOTO to Database
router.post('/avatar', requireToken, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { Avatar: `${hostname}/image/${req.file.filename}` } },
      { new: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Try again later, something went wrong' });
  }
});


// @route GET /image/:filename
// @desc Display Image
router.get('/image/:filename', (req, res) => {
  console.log("image route invoked")
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      console.log("file not found")
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    console.log("file found")
    // Check if mimetype
    if (file.contentType === 'application/pdf' ) {
      const bucket = new mongoose.mongo.GridFSBucket(conn, { bucketName: 'uploads' })
      let readStream = bucket.openDownloadStream(file._id)
      readStream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});



router.post('/personalinformation', requireToken, async (req, res) => {
  const Id  = req.user.id;

  try {
    const userToSend = {
      employeeId: req.user.employeeId,
      name: req.user.name,
      phone: req.user.phone,
      email: req.user.email,
      address: req.user.address,
      designation: req.user.designation,
      username: req.user.username,
    };

    console.log(userToSend)

    res.json(userToSend);
  } catch (error) {
    
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/updateempinfo', requireToken, async (req, res) => {
  // const id = req.user.id;
  const { employeeId, name, phone, email, address, designation, username } = req.body;

  try {
    
    req.user.employeeId = employeeId;
    req.user.name = name;
    req.user.phone = phone;
    req.user.email = email;
    req.user.address = address;
    req.user.designation = designation;
    req.user.username = username;

    await req.user.save();

    return res.status(200).json({ message: 'User updated successfully'});
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});


router.post('/emppastleave', requireToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const approvedLeaves = user.pastLeave.filter(leave => leave.status === "Approve");

    res.json(approvedLeaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.post('/empname', requireToken, async (req, res) => {
  try {
    const userId = req.user.id;   

    const user = await User.findById(userId).select('name');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ name: user.name });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = router