const express=require('express')
const {resendOtp}=require('../controllers/auth')
const {body} =require('express-validator') 
const {validatereq}=require('../middlewares/validateReq')
const router=express.Router()

router.post('/resend-otp',
[
    body('email').isEmail().withMessage('Email must be valid'),
],
validatereq
,resendOtp)
module.exports={resend_otp:router}