const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const { jwtkey } = require('../../keys');
const requireToken = require('../../middleware/requireToken');
const router = express.Router();
const User = mongoose.model('User');
const Admin = mongoose.model('Admin');
const Leave = mongoose.model('Leave');

router.post('/addmeeting', async (req, res) => {
    const { meetingdate, meetingtime } = req.body;

    try {
      
        const leave = await Leave.findById('64f43f0eeedc485379bbf3de');

        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }

     
        leave.meetingdate = meetingdate;
        leave.meetingtime = meetingtime;
        await leave.save();

        return res.status(200).json({ message: 'Meeting date updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating meeting date', error: error.message });
    }
});

router.post('/fetchmeetinginfo', async (req, res) => {
    try {
      const id = "64f43f0eeedc485379bbf3de";
  
      const leaveDoc = await Leave.findById(id);
  
      if (!leaveDoc || !leaveDoc.meetingdate || !leaveDoc.meetingtime) {
        const meeting={
            date: "No current meeting",
            time: ""
          }
        return res.send(meeting);
      }
  
      const currentDate = new Date();
    //   console.log(currentDate)
      const meetingDateTime = new Date(`${leaveDoc.meetingdate} ${leaveDoc.meetingtime}`);
    //   console.log(meetingDateTime)
  
      if (currentDate > meetingDateTime) {
        const meeting={
            date: "No current meeting",
            time: ""
          }
        return res.send(meeting);
      }
  
      // Format the meetingdate and meetingtime
      const formattedMeetingDate = meetingDateTime.toDateString();
      const formattedMeetingTime = meetingDateTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });

      const meeting={
        date: formattedMeetingDate,
        time: formattedMeetingTime,
      }
  
      res.send(meeting);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });

  router.post('/addholiday', async (req, res) => {
    const { holidaydate } = req.body;

    try {
        const leave = await Leave.findById('64f43f0eeedc485379bbf3de');

        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }

        leave.holidaydate = holidaydate;
        await leave.save();

        return res.status(200).json({ message: 'Holiday date updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating holiday date', error: error.message });
    }
});


module.exports = router;