const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const { jwtkey } = require('../../keys');
const requireToken = require('../../middleware/requireToken');
const router = express.Router();
const User = mongoose.model('User');
const Leave = mongoose.model('Leave');
const Admin = mongoose.model('Admin');

router.post('/adddocument', async (req, res) => {
    try {
      const leave = new Leave();
  
      await leave.save();
      console.log('Leave document created successfully:', leave);
  
      res.status(201).json({ message: 'Leave document created successfully', leave });
    } catch (error) {
      console.error('Error creating leave document:', error);
      res.status(500).json({ message: 'Error creating leave document' });
    }
  });

  router.post('/addadmindocument', async (req, res) => {
    try {
      const admin = new Admin();
  
      await admin.save();
      console.log('Admin document created successfully:', admin);
  
      res.status(201).json({ message: 'Admin document created successfully', admin });
    } catch (error) {
      console.error('Error creating leave document:', error);
      res.status(500).json({ message: 'Error creating leave document' });
    }
  });
  


module.exports = router;