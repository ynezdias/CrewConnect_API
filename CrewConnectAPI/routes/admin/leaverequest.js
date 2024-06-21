const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const { jwtkey } = require('../../keys');
const requireToken = require('../../middleware/requireToken');
const router = express.Router();
const User = mongoose.model('User');
const Admin = mongoose.model('Admin');
const Leave = mongoose.model('Leave');



router.post('/displayleave', async (req, res) => {
  try {
    // Find documents with at least one leaveRequest object
    const leaves = await Leave.find({ leaveRequest: { $exists: true, $not: { $size: 0 } } });

    // Extract the leaveRequest objects from the documents
    const leaveRequests = leaves.flatMap((leave) => leave.leaveRequest);

    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve leave requests' });
  }
});

router.post('/approveleave', async (req, res) => {
  const { Lid, id, fromdate, todate, approvedate } = req.body;

  try {

    const leave = await Leave.findOne({ _id: Lid });

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }


    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the index of the matching leaveRequest object
    const index = leave.leaveRequest.findIndex(
      (obj) => obj.id === id && obj.fromdate === fromdate
    );

    if (index === -1) {
      return res.status(404).json({ message: 'Leave request not found' });
    }



    leave.leaveRequest[index].status = 'Approve';
    leave.leaveRequest[index].approvedate = approvedate;

    // Copy the leaveRequest object to the pastLeave field of the User schema
    user.pastLeave.push(leave.leaveRequest[index]);

    // Remove the leaveRequest object from the Leave schema
    leave.leaveRequest.splice(index, 1);

    // Convert the date strings into Date objects
    const d1 = new Date(fromdate);
    const d2 = new Date(todate);

    // Set the time to 00:00:00 for both dates
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    // Calculate the time difference in milliseconds
    const timeDifference = Math.abs(d2 - d1);

    // Convert milliseconds to days
    const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1;

    console.log(days);

    user.takenLeave = user.takenLeave + days;

    if (user.remainingLeave > 0) {
      user.remainingLeave = user.remainingLeave - days;
    }

    
    await user.save();
    await leave.save();

    res.status(200).json({ message: 'Leave copied successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/rejectleave', async (req, res) => {
  const { Lid, id, fromdate } = req.body; 

  try {
    
    const leave = await Leave.findOne({ _id: Lid });

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the index of the matching leaveRequest object
    const index = leave.leaveRequest.findIndex(
      (obj) => obj.id === id && obj.fromdate === fromdate
    );

    if (index === -1) {
      return res.status(404).json({ message: 'Leave request not found' });
    }


    
    leave.leaveRequest[index].status = 'Reject';

   
    user.pastLeave.push(leave.leaveRequest[index]);

    // Remove the leaveRequest object from the Leave schema
    leave.leaveRequest.splice(index, 1);

    await user.save();
    await leave.save();

    res.status(200).json({ message: 'Leave copied successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/empleavesummary', async (req, res) => {
  const userId = req.body.id;

  try {
    const user = await User.findById(userId, 'takenLeave remainingLeave');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { takenLeave, remainingLeave } = user;

    res.json({ takenLeave, remainingLeave });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/pastleavedetails', async (req, res) => {
  const userId = req.body.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter pastLeave objects where status is "Approved"
    const approvedLeaves = user.pastLeave.filter(leave => leave.status === "Approve");

    res.json(approvedLeaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/pastleavedetails2', async (req, res) => {
  const employeeId = req.body.employeeId;

  try {
    const user = await User.findOne({ employeeId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter pastLeave objects where status is "Approved"
    const approvedLeaves = user.pastLeave.filter(leave => leave.status === "Approve");

    res.json(approvedLeaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/displaywfh', async (req, res) => {
  try {
    // Find documents with at least one leaveRequest object
    const wfh = await Leave.find({ wfhRequest: { $exists: true, $not: { $size: 0 } } });

    // Extract the leaveRequest objects from the documents
    const wfhRequests = wfh.flatMap((wfh) => wfh.wfhRequest);

    res.json(wfhRequests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve wfh requests' });
  }
});

router.post('/approvewfh', async (req, res) => {
  const { Lid, id, fromdate, todate, approvedate } = req.body; 

  try {
   
    const wfh = await Leave.findOne({ _id: Lid });

    if (!wfh) {
      return res.status(404).json({ message: 'Wfh not found' });
    }

    
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const index = wfh.wfhRequest.findIndex(
      (obj) => obj.id === id && obj.fromdate === fromdate
    );

    if (index === -1) {
      return res.status(404).json({ message: 'Wfh request not found' });
    }


    wfh.wfhRequest[index].status = 'Approve';
    wfh.wfhRequest[index].approvedate = approvedate;

    user.pastWfh.push(wfh.wfhRequest[index]);

    wfh.wfhRequest.splice(index, 1);

    await user.save();
    await wfh.save();

    res.status(200).json({ message: 'Wfh copied successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/rejectwfh', async (req, res) => {
  const { Lid, id, fromdate } = req.body; 

  try {
    
    const wfh = await Leave.findOne({ _id: Lid });

    if (!wfh) {
      return res.status(404).json({ message: 'Wfh not found' });
    }

    
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    const index = wfh.wfhRequest.findIndex(
      (obj) => obj.id === id && obj.fromdate === fromdate
    );

    if (index === -1) {
      return res.status(404).json({ message: 'Wfh request not found' });
    }


    
    wfh.wfhRequest[index].status = 'Reject';

 
    user.pastWfh.push(wfh.wfhRequest[index]);

   
    wfh.wfhRequest.splice(index, 1);

    await user.save();
    await wfh.save();

    res.status(200).json({ message: 'Wfh copied successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;