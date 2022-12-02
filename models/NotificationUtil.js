const mongoose=require('mongoose')

const Notification=mongoose.Schema({
    msg:{
        type:String,
    },
    finished:{
        type:Boolean,
        default:false
    }
},
{ timestamps: true })

module.exports={Notification}