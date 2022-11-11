const express=require('express')
const {forgotPassword}=require('../controllers/auth')
const router=express.Router()

router.post('/forgot-pass',forgotPassword)
module.exports={forgot_pass:router}