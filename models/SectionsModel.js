const mongoose=require('mongoose')
const Section=mongoose.Schema({
    sectionChar:{
        type:String,
        required:true
    },
    capacity:{
        type:Number,
        required:true
    },
    parkingId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
},
{ timestamps: true })
module.exports={section:mongoose.model('Section',Section)}

