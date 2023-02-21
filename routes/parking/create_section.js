const express=require('express')
const router=express.Router()
const {Auth}=require('../../middlewares/auth')
const {checkParking}=require('../../middlewares/check_parking')
const {create_section}=require('../../controllers/parking')
router.post('/create-section',Auth,create_section)
module.exports={createSection:router}