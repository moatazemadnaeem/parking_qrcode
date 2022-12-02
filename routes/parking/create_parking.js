const express=require('express')
const router=express.Router()
const {Auth}=require('../../middlewares/auth')
const {checkParking}=require('../../middlewares/check_parking')
const {create_parking}=require('../../controllers/parking')
router.post('/create-parking',Auth,checkParking,create_parking)
module.exports={createParking:router}