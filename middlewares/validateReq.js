const {validationResult}= require('express-validator') 
const { validateincomingreq }= require('../errorclasses/incomingReq') 
const validatereq=(req,res,next)=>{
    const error =validationResult(req)
    if(!error.isEmpty()){
        throw new validateincomingreq(error.array())
    }
    next()
}
module.exports={validatereq}