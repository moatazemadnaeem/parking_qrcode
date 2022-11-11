const {user} =require('../models/BaseModel')
const IsValidUser=async(payload)=>{

    const {id}=payload;

    const User=await user.findById(id)

    if(User.IsValid){
        return true
    }

    return false
}
module.exports={IsValidUser}