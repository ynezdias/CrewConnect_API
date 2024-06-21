const mongoose=require('mongoose');
const bcrypt=require('bcrypt')

const adminSchema=new mongoose.Schema({

    username:{
        type:String,
        unique:true,
        default:""
    },

    password:{
        type:String,
        default:""
    }

})


mongoose.model('Admin',adminSchema)