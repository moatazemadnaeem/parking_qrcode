const jwt=require('jsonwebtoken')
const ExtractPayload=(req,res,next)=>{
    if(!req.session?.jwt){
        return next()
    }
    try{
        const payload=jwt.verify(req.session.jwt,process.env.JWT_KEY) 
        req.currentUser=payload
        return next()

    }catch(err){
        return next()
    }
}
module.exports={ExtractPayload}