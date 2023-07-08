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
const {bufferToDataURI}=require('../utils/turnBuffertoDataURI')
const {uploadToCloudinary}=require('../utils/uploadImage')
module.exports={
    signup:async(req,res)=>{
        const {name,email,password}=req.body;
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
          const User=await user.create({name,email,otp,password:hashPass(password)})
          for(let i=0;i<img.length;i++){
            let item=img[i]
            const fileFormat = item.mimetype.split('/')[1]
            const { base64 } = bufferToDataURI(fileFormat, item.data)
            const imageDetails = await uploadToCloudinary(base64, fileFormat)
            console.log(imageDetails)
            User.imgPath.push(imageDetails.url)
            console.log(User)
            await User.save()
        }
        SendEmail(User.email,User.otp)
        let L=User.imgPath.length-1;
        if(L<0){
            return res.status(201).send({name:User.name,email:User.email,status:true,images:User.imgPath,lastImg:'there is no last image',id:User._id})
        }
        return res.status(201).send({name:User.name,email:User.email,status:true,images:User.imgPath,lastImg:User.imgPath[L],id:User._id})} 
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
            const {name,email,_id,imgPath}= await user.findById(req.currentUser.id)
            let L=imgPath.length-1;
            if(L<0){
                return res.send({
                    name,
                    email,
                    id:_id,
                    status:true,
                    images:imgPath,
                    lastImg:'there is no last image'
                })
            }
            return res.send({
                name,
                email,
                id:_id,
                status:true,
                images:imgPath,
                lastImg:imgPath[L]
            })
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
    },
     resendOtp:async(req,res)=>{
        const {email}=req.body;
        try{
            const exists=await user.findOne({email})
            if(!exists){
               throw new BadReqErr('Email Not found')
            }
            const uniqueString=GetRandString()
            exists.uniqueString=uniqueString;
            await exists.save()
           
            SendEmail(exists.email,exists.uniqueString);
    
            return res.status(200).send({msg:'Otp sent Successfully.'})
           }catch(err){
            throw new BadReqErr(err.message)
           }
    },
    resendOtpReset:async(req,res)=>{
        const {email}=req.body;
        try{
            const exists=await user.findOne({email})
            if(!exists){
               throw new BadReqErr('Email Not found')
            }
            const uniqueString=GetRandString()
            exists.uniqueResetPassStr=uniqueString;
            await exists.save()
           
            SendEmail(exists.email,exists.uniqueResetPassStr,true);
    
            return res.status(200).send({msg:'Otp sent Successfully.'})
           }catch(err){
            throw new BadReqErr(err.message)
           }
    },
    editProfileImg:async(req,res)=>{
        const id=req.currentUser.id;
        if(!id){
            throw new BadReqErr('there is no user id')
        }
        try{
            const User= await user.findById(id)
            if(!User){
                throw new notfound('not found the User')
            }
            let img=[];
            if(req.files){
                if(req.files.img.length===undefined){
                    img=[req.files.img];
                }else{
                    img=[...req.files.img];
                }
            }
            for(let i=0;i<img.length;i++){
                let item=img[i]
                const fileFormat = item.mimetype.split('/')[1]
                const { base64 } = bufferToDataURI(fileFormat, item.data)
                const imageDetails = await uploadToCloudinary(base64, fileFormat)
                console.log(imageDetails)
                User.imgPath.push(imageDetails.url)
                await User.save()
             }
             return res.status(200).send({status:true,images:User.imgPath})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    update_user:async(req,res)=>{
        if(req.currentUser){
            const {name,password}=req.body
          
            try{
               const User= await user.findById(req.currentUser.id)
               User.name=name?name:User.name;
               User.password=password?hashPass(password):User.password;
             
               await User.save()
               
               return res.status(200).send({name:User.name,email:User.email,status:true})
            }catch(err){
               throw new notfound('this user can not be found')
            }
        }else{
            return res.send({currentUser:null})
        }
       
    },
}