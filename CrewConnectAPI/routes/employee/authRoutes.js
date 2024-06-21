const express=require('express')
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
// const {jwtkey}=require('../../keys')
const router=express.Router();
const User=mongoose.model('User');


router.post('/signup',async (req,res)=>{
    const {employeeId,name,phone,email,address,designation,username,password}=req.body;
    const totalLeave=20;
    const takenLeave=0;
    const remainingLeave=20;
    const Avatar="https://firebasestorage.googleapis.com/v0/b/crewconnect-f0163.appspot.com/o/No_Profile.jpg?alt=media&token=8b69af1a-73ba-4b10-b25c-4a41137874ad&_gl=1*199to8y*_ga*MTQwODQ3ODc3Mi4xNjk3MzA4MTEw*_ga_CW55HF8NVT*MTY5NzUxNzAyOS42LjEuMTY5NzUxNzA4Ni4zLjAuMA..";


    try{

        const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).send({ message: 'Username Already Taken' });
    }

        const user=new User({employeeId,name,phone,email,address,designation,username,password,totalLeave,takenLeave,remainingLeave,Avatar});
        await user.save();
        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET)
        res.send({token})
    }catch(err){
        return res.status(422).send(err.message)
    }

})

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(422).send({ error: "Must provide username and password" });
    }
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).send({ error: "Invalid credentials" });
      }
  
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).send({ error: "Invalid credentials" });
      }
  
      const token = jwt.sign({ userId: user._id },process.env.JWT_SECRET);
      res.send({ token });
    } catch (err) {
      return res.status(500).send({ error: "Internal server error" });
    }
  });
  

module.exports = router