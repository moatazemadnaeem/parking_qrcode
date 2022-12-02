const express=require('express')
const router=express.Router()
const {Auth}=require('../../middlewares/auth')
const {checkDriver}=require('../../middlewares/check_driver')
const {remove_cars}=require('../../controllers/parking')
router.delete('/remove-cars',Auth,checkDriver,remove_cars)
module.exports={removeCars:router}