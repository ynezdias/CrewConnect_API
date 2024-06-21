const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const { jwtkey } = require('../../keys');
const requireToken = require('../../middleware/requireToken');
const router = express.Router();
const User = mongoose.model('User');
const Admin = mongoose.model('Admin');
const Leave = mongoose.model('Leave');


router.post('/viewuploadeddoc', async (req, res) => {
  
    try {
      const leave = await Leave.findById('64f43f0eeedc485379bbf3de');
  
      if (!leave) {
        return res.status(404).json({ error: 'Leave not found' });
      }
  
      const fileuploads = leave.fileuploads;
  
      return res.json(fileuploads);
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  });



module.exports = router;