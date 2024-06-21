const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const { jwtkey } = require('../../keys');
const requireToken = require('../../middleware/requireToken');
const router = express.Router();
const User = mongoose.model('User');
const Admin = mongoose.model('Admin');
const Leave = mongoose.model('Leave');


router.post('/loaddashboard', requireToken, async (req, res) => {
  try {

    const totalLeave = req.user.totalLeave;
    const takenLeave = req.user.takenLeave;
    const remainingLeave = req.user.remainingLeave;
    const Avatar=req.user.Avatar;

    res.json({ totalLeave, takenLeave, remainingLeave, Avatar });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

router.post('/fetchmeeting', async (req, res) => {
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

router.post('/fetchholiday', async (req, res) => {
  try {
    const id = "64f43f0eeedc485379bbf3de";

    const leaveDoc = await Leave.findById(id);

    if (!leaveDoc || !leaveDoc.holidaydate) {
      const holiday={
          date: "No upcoming Holiday",
        }
      return res.send(holiday);
    }

    const currentDate = new Date();
  //   console.log(currentDate)
    const holidayDateTime = new Date(`${leaveDoc.holidaydate}`);
  //   console.log(meetingDateTime)

    if (currentDate > holidayDateTime) {
      const holiday={
          date: "No upcoming Holiday",
        }
      return res.send(holiday);
    }

    const formattedHolidayDate = holidayDateTime.toDateString();

    const holiday={
      date: formattedHolidayDate,
    }
    res.send(holiday);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});


router.post('/fetchnotifications', requireToken, async (req, res) => {
  try {
    const notifications = req.user.notifications;
    return res.json(notifications);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

router.post('/fetchannouncements', async (req, res) => {
  try {

    const leave = await Leave.findById("64f43f0eeedc485379bbf3de");

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    const notices = leave.notices;

    res.json(notices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
