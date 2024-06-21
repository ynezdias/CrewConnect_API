const express = require("express");
const mongoose = require('mongoose');
const requireToken = require('../../middleware/requireToken');
const router = express.Router();
const admin = require("firebase-admin");
const multer = require("multer");
const serviceAccount = require("./serviceAccountKey.json"); 
const Leave = mongoose.model('Leave');



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "crewconnect-f0163.appspot.com", 
});

const bucket = admin.storage().bucket();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/sharefile", requireToken, upload.single("file"), async(req, res) => {

  console.log("reachead")

  let description = req.body.description;
  const name = req.user.name;
  
  const file = req.file;

  const currentDateTime = new Date();

  const year = currentDateTime.getFullYear();
  const month = currentDateTime.getMonth() + 1; 
  const day = currentDateTime.getDate();

  const hours = currentDateTime.getHours();
  const minutes = currentDateTime.getMinutes();
  const seconds = currentDateTime.getSeconds();


  const date = `${year}-${month}-${day}`;
  const time = `${hours}:${minutes}`;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const fileRef = bucket.file(file.originalname);
  const blobStream = fileRef.createWriteStream();

  blobStream.on("error", (error) => {
    res.status(500).send("File upload error: " + error);
  });

  blobStream.on("finish", () => {
    fileRef.makePublic().then(async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;


      try {

        const leave = await Leave.findById("64f43f0eeedc485379bbf3de");

        if (!leave) {
          return res.status(404).json({ error: 'Leave not found' });
        }

        const newFile = {
          name: name,
          publicUrl: publicUrl,
          description: description,
          date: date,
          time: time,
        };

        leave.fileuploads.push(newFile);

        await leave.save();
        res.status(200).json({ message: 'Notice added successfully', leave });

      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }

    });
  });



  blobStream.end(file.buffer);
});

module.exports = router;
