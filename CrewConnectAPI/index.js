require("dotenv").config();
const express = require('express')
const cors = require("cors");
const bodyParser=require('body-parser')
const mongoose=require('mongoose')

const app=express()
const PORT=3000


// const {mongoUrl}=require('./keys') 

require('./models/User');
require('./models/Admin');
require('./models/Leave');


const requireToken=require('./middleware/requireToken')


const authRoutes=require('./routes/employee/authRoutes')
const auth=require('./routes/admin/auth')
const leave=require('./routes/employee/leave')
const leaverequest=require('./routes/admin/leaverequest')
const addDoc=require('./routes/employee/addDoc')
const dashboard=require('./routes/employee/dashboard')
const profile=require('./routes/employee/profile')
const profile2=require('./routes/employee/profile2')
const adminprofile=require('./routes/admin/adminprofile')
const meetingandholiday=require('./routes/admin/meetingandholiday')
const messageandnotice=require('./routes/admin/messageandnotice')
const fileupload=require('./routes/employee/fileupload')
const documents=require('./routes/admin/documents') 


app.use(cors())
app.use(bodyParser.json())
app.use(authRoutes)
app.use(auth)
app.use(leave)
app.use(leaverequest)
app.use(addDoc)
app.use(dashboard)
app.use(profile)
app.use(profile2)
app.use(adminprofile)
app.use(meetingandholiday)
app.use(messageandnotice)
app.use(fileupload)
app.use(documents)

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected',()=>{
    console.log("connected to mongo yeahh")
})
mongoose.connection.on('error',(err)=>{
    console.log("this is error",err)
})

//app.use(bodyParser.json())

app.get('/',requireToken,(req,res)=>{
    res.send({username:req.user.username})
})

app.listen(PORT,()=>{
    console.log("server running"+PORT)
})