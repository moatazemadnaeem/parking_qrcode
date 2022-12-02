const {validationResult} =require('express-validator')
const {validateincomingreq}=require('../errorclasses/incomingReq')
const {BadReqErr}=require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const {NotAuth}=require('../errorclasses/notauth')
const {user}=require('../models/BaseModel')
const {hashPass,comparePass}=require('../utils/password')
const jwt =require('jsonwebtoken')
const {SendEmail}=require('../utils/sendEmail')
const {GetRandString}=require('../utils/randomString')
const { Roles } = require('../utils/roles')

module.exports={
    signup:async(req,res)=>{
        const error =validationResult(req)
        console.log('error:',error.array())
        if(!error.isEmpty()){
            throw new validateincomingreq(error.array())
        }
        const {name,email,password,role}=req.body;
        if(role===Roles.ADMIN){
            throw new NotAuth('You Are Not allowed to do that.')
        }
        if(!role){
            throw new NotAuth('You should provide a role')
        }
        if(!Roles[role]){
            throw new NotAuth('You provided a bad role')
        }
        console.log(email)
       const exists=await user.findOne({email})
       if(exists){
        console.log('user already exists')
       throw new BadReqErr('Email is already in use')
       }
       else{
        let img=[];
        if(req.files){
            if(req.files.img.length===undefined){
                img=[req.files.img];
            }else{
                img=[...req.files.img];
            }
        }
          const otp=GetRandString();
         
          const User=await user.create({name,email,otp,password:hashPass(password),role})
        for(let i=0;i<img.length;i++){
            let item=img[i]
            let rand=GetRandString()
            User.imgPath.push(`https://parking-167s.onrender.com/static/${process.env.STATE==='DEV'?'Dev':'Prod'}/${rand+item.name}`)
            await User.save()
            item.mv(`./images/${rand+item.name}`)
        }
          const token= jwt.sign({
              id:User._id,
          },process.env.JWT_KEY)
          req.session={
              jwt:token
          }
          SendEmail(User.email,User.otp)
          return res.status(201).send({name:User.name,email:User.email,id:User._id,role:User.role,status:true,token})
       } 
    },
    signin:async(req,res)=>{
        
    const {email,password}=req.body;
    //if user exist

    const existingUser=await user.findOne({email})
    if(!existingUser){
        throw new BadReqErr('invalid creds ')
    }

    //check if he/she is valid
    if(!existingUser.IsValid){
        throw new NotAuth('Please check your email to validate')
    }

    //check password
    const validate=comparePass(password,existingUser.password)
    if(!validate){
        throw new BadReqErr('invalid creds ')
    }

    //send jwt 
    const token= jwt.sign({
        id:existingUser._id,
    },process.env.JWT_KEY)
    req.session={
        jwt:token
    }
    console.log(existingUser)
    //send data
    res.status(200).send({
        name:existingUser.name,
        email:existingUser.email,
        status:true,
        id:existingUser._id,
        token,
        role:existingUser.role
    })
    },
    signout:async(req,res)=>{
        req.session=null
        res.send({
            token:null,
            currentUser:null,
        })
    },
    current:async(req,res)=>{
        //check first is the session object exist and then check jwt
        if(req.currentUser){
          try{
            const {name,email,_id}= await user.findById(req.currentUser.id)
            return res.send({currentUser:{
                name,
                email,
                id:_id,
                status:true
            }})
          }catch(err){
            throw new notfound('this user can not be found')
          }
         
        }
        return res.send({currentUser:null})
    },
    verfiyUser:async(req,res)=>{
        const {uniqueString}=req.params;
        try{
            const User=await user.findOne({otp:uniqueString})
    
            if(User){
                User.IsValid=true;
                await User.save()
                res.send('<h1>Done Verifying Please Return Back To The App.</h1>')
            }
            else{
                throw new notfound('can not find the user')
            }
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    forgotPassword:async(req,res)=>{
        const {email}=req.body;
        
        const existingUser=await user.findOne({email})
        if(!existingUser){
            throw new BadReqErr('Can Not Find This Email.')
        }

        const otp=GetRandString()

        existingUser.set({uniqueResetPassStr:otp})

        await existingUser.save()

        //send true to make this function act like forgot pass
        SendEmail(email,otp,true)

        return res.status(200).send({msg:'OTP sent to your email for reseting your password please check it out.',status:true})

    },
    sendOtp:async(req,res)=>{
        const {email,uniqueString}=req.body;
        const existingUser=await user.findOne({email})
        if(!existingUser){
            throw new BadReqErr('Can Not Find This Email.')
        }

        if(existingUser.uniqueResetPassStr!==uniqueString){
            throw new BadReqErr('Bad Creds Please check your gmail for the OTP')
        }
        return res.status(200).send({msg:'Success Now your able to reset your password',status:true})
    },
    resetPassword:async(req,res)=>{
        const {email,newpass}=req.body;
        const existingUser=await user.findOne({email})
        if(!existingUser){
            throw new BadReqErr('Can Not Find This Email.')
        }
        existingUser.set({password:hashPass(newpass)})
        await existingUser.save()
        return res.status(200).send({msg:'Now you can use your new password',status:true})
    }
}