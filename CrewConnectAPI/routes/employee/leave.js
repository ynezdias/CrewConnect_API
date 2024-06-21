const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const { jwtkey } = require('../../keys');
const requireToken = require('../../middleware/requireToken');
const router = express.Router();
const User = mongoose.model('User');
const Admin = mongoose.model('Admin');
const Leave = mongoose.model('Leave');


const generatedNumbers = [];

function generateRandomNumber() {
  const min = 1000; 
  const max = 9999; 
  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  while (generatedNumbers.includes(randomNumber)) {
    randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generatedNumbers.push(randomNumber);

  return randomNumber;
}

router.post('/leaverequest', requireToken, async (req, res) => {
  let { fromdate, todate, reason } = req.body;
  let name = req.user.name;
  let id = req.user.id;
  let code = generateRandomNumber();

  try {

    await Leave.updateOne(
      { _id: "64f43f0eeedc485379bbf3de" },
      {
        $push: {
          leaveRequest: {
            id: id,
            name: name,
            fromdate: fromdate,
            todate: todate,
            reason: reason,
            code: code,
            status:'',
            approvedate:''
          }
        }
      }
    );


    res.send("Success");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/pastleave', requireToken, async (req, res) => {
  try {

    const pastLeave = req.user.pastLeave;
    return res.json(pastLeave);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

router.post('/leavesummary', requireToken, async (req, res) => {
  try {

    const takenLeave = req.user.takenLeave;
    const remainingLeave = req.user.remainingLeave;
    return res.json({takenLeave,remainingLeave});
    
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});


router.post('/wfhrequest', requireToken, async (req, res) => {
  let { fromdate, todate, reason } = req.body;
  let name = req.user.name;
  let id = req.user.id;
  let code = generateRandomNumber();

  try {
    await Leave.updateOne(
      { _id: "64f43f0eeedc485379bbf3de" },
      {
        $push: {
          wfhRequest: {
            id: id,
            name: name,
            fromdate: fromdate,
            todate: todate,
            reason: reason,
            code: code,
            status:'',
            approvedate:''
          }
        }
      }
    );


    

    res.send("Success");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


router.post('/pastwfh', requireToken, async (req, res) => {
  try {

    const pastWfh = req.user.pastWfh;
    return res.json(pastWfh);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});



module.exports = router;
