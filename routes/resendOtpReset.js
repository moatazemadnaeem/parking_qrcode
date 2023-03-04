const express=require('express')
const {resendOtpReset}=require('../controllers/auth')
const {body} =require('express-validator') 
const {validatereq}=require('../middlewares/validateReq')
const router=express.Router()

router.post('/resend-otp-reset',
[
    body('email').isEmail().withMessage('Email must be valid'),
],
validatereq
,resendOtpReset)
module.exports={resend_otp_reset:router}