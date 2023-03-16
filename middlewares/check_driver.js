const {user}=require('../models/BaseModel')
const {NotAuth}=require('../errorclasses/notauth')
const {Roles}=require('../utils/roles')
const checkDriver=async(req,res,next)=>{
    const {id}=req.currentUser;

    const User=await user.findById(id)

    if(User.role!==Roles.DRIVER){
       return next(new NotAuth('You are not driver to perform this action'))
    }

    return next()
}

module.exports={checkDriver}