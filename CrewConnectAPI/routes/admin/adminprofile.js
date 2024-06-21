const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const { jwtkey } = require('../../keys');
const requireToken = require('../../middleware/requireToken');
const router = express.Router();
const User = mongoose.model('User');
const Admin = mongoose.model('Admin');
const Leave = mongoose.model('Leave');

// Route to fetch id, name, and designation fields of all User documents
router.post('/fetchemployees', async (req, res) => {
    try {
      
      const users = await User.find({}, '_id name designation employeeId phone email address Avatar').exec();

      console.log(users._id)
  
     
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/getemployee', async (req, res) => {
    try {
      const {id} = req.body;
  
      
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      
      const userData = {
        employeeId: user.employeeId,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
        designation: user.designation,
        Avatar: user.Avatar,
      };
  
      res.json(userData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
  module.exports = router;