const mongoose=require('mongoose')
const Nearest=mongoose.Schema({
    place:{
        type:[String],
        default:[]
    },
    gate:{
        type:Number,
        required:true
    },
    distanceToCenter:{
        type:Number,
        required:true
    },
    parkingId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
},
{ timestamps: true })
module.exports={nearestModel:mongoose.model('Nearest',Nearest)}

