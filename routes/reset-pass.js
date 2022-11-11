const express=require('express')
const {resetPassword}=require('../controllers/auth')
const router=express.Router()

router.post('/reset-pass',resetPassword)
module.exports={reset_pass:router}