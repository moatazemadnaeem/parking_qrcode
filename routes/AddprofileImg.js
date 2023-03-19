const express=require('express')
const {editProfileImg}=require('../controllers/auth')
const {Auth} =require('../middlewares/auth')

const router=express.Router()

router.put('/add_profile_pic',Auth,editProfileImg)
module.exports={add_profile_pic:router}