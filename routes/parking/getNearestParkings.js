const express=require('express')
const router=express.Router()
const {Auth}=require('../../middlewares/auth')
const {checkDriver}=require('../../middlewares/check_driver')
const {get_nearest_parkings}=require('../../controllers/parking')
router.get('/get-nearest-parkings',Auth,checkDriver,get_nearest_parkings)
module.exports={getNearestParkings:router}