const express=require('express')
const {update_user}=require('../controllers/auth')
const {validatereq}=require('../middlewares/validateReq')
const {body}= require('express-validator') 
const {Auth} =require('../middlewares/auth')
const router=express.Router()

router.put('/update_user',Auth,
[
    body('name').optional().isLength({min:3,max:255}).withMessage('name must be at least 3 chars long and 255 max'),
    body('password').optional().trim().isLength({min:6,max:255}).withMessage('Password must be at least 6 chars long and 255 max')
],
validatereq,
update_user)
module.exports={updateUser:router}