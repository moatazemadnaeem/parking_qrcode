const mongoose=require('mongoose')

const Location=mongoose.Schema({
    lon:{
        type:Number,
        required:true
    },
    lat:{
        type:Number,
        required:true
    }
},
{ timestamps: true })

module.exports={Location}