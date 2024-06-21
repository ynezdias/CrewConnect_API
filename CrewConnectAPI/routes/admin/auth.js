const express=require('express')
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
// const {jwtkey}=require('../../keys')
const router=express.Router();
const Admin=mongoose.model('Admin');


router.post('/adminlogin', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Search for the admin with the given username
      const admin = await Admin.findOne({ username });
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      
      if (admin.password !== password) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
  
    
      return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router