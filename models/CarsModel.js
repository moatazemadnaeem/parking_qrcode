const mongoose=require('mongoose')
const Car=mongoose.Schema({
    carId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    startTime:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    numLocation:{
        type:Number
    },
    sectionChar:{
        type:String,
    },
    parkingId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
},
{ timestamps: true })
module.exports={car:mongoose.model('Car',Car)}