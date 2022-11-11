const express=require('express')
const {signout}=require('../controllers/auth')

const router=express.Router()

router.get('/signout',signout)
module.exports={signout:router}