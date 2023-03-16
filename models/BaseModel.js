const mongoose=require('mongoose')
const {Notification}=require('./NotificationUtil')
// const {Roles}=require('../utils/roles')
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
    },
    history:{
        type:[Number]
    },
    IsAdmin:{
        type:Boolean,
        default:false
    }
},
{ timestamps: true })
module.exports={user:mongoose.model('User',BaseSchema)}