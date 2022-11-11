const mongoose=require('mongoose')
const {Notification}=require('./NotificationModel')
const BaseSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
    },
    IsValid:{
        type:Boolean,
        default:false,
    },
    uniqueResetPassStr:{
        type:String,
    },
    notifications:{
        type:[Notification]
    },
    imgPath:{
        type:[String],
    }
},
{ timestamps: true })
module.exports={user:mongoose.model('User',BaseSchema)}