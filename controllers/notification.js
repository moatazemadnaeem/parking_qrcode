const {BadReqErr}=require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const {InternalServerErr}=require('../errorclasses/InternalServer')
const {SendEmailNotification}=require('../utils/sendEmailNotification')
const {user}=require('../models/BaseModel')
module.exports={
    pushNotification:async(req,res)=>{
        const {email,msg}=req.body

        if(!email||!msg){
            throw new BadReqErr('Please Provide the right creds')
        }

        try{
            const User=await user.findOne({email})
            if(!User){
                throw new notfound('Can not find this email please try again.')
            }
        }catch(err){
            throw new BadReqErr(err.message)
        }

        try{
           await SendEmailNotification(email,msg)
        }catch(err){
            InternalServerErr('Sorry something went wrong on our server please try again another time Thanks.')
        }
        
        return res.status(201).send({msg:'Notification Sent Successfully...',status:true})
    }
}