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
  
    // Check if the number is already generated
    while (generatedNumbers.includes(randomNumber)) {
      randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    }
  
    // Add the number to the generatedNumbers array
    generatedNumbers.push(randomNumber);
  
    return randomNumber;
  }

router.post('/sendnotification', async (req, res) => {
    try {
        const {id, employeeId, message } = req.body;

        const messenger="Project Manager"

        let code = generateRandomNumber();
    
      
        const user = await User.findById(id);
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        const newNotification = { employeeId, messenger, message ,code};
    
        user.notifications.push(newNotification);
    
        await user.save();
    
        res.status(200).json({ message: 'Notification added successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
});

router.post('/sendnotice', async (req, res) => {
  try {
    const { subject, message } = req.body;

    let code = generateRandomNumber();

    const leave = await Leave.findById("64f43f0eeedc485379bbf3de");

    if (!leave) {
      return res.status(404).json({ error: 'Leave not found' });
    }

    const newNotice = {
      subject,
      message,
      code,
    };

    leave.notices.push(newNotice);

    await leave.save();

    res.status(200).json({ message: 'Notice added successfully', leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;