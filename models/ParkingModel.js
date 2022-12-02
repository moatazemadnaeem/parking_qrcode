const mongoose=require('mongoose')
const {Location}=require('./LocationUtil')
const Parking=mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  img:{
    type:[String]
  },
  desc:{
    type:String,
    required:true
  },
  rate:{
    type:Number
  },
  availableSections:{
    type:[String],
    default:[undefined,'b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
  },
  takenSections:{
    type:[Object],
  },
  nearest:{
    type:[Object],
    required:true
  },
  haveSections:{
    type:Boolean,
    default:false
  },
  location:{
    type:Location,
    required:true
  },
  fullCapacity:{
    type:Number,
    required:true
  },
  loc: {
    type:Object,
    required:true
  }
},
{ timestamps: true })
Parking.index( { "loc" : "2dsphere" } )
module.exports={parking:mongoose.model('Parking',Parking)}