const express=require('express')
const router=express.Router()
const {Auth}=require('../../middlewares/auth')
const {checkDriver}=require('../../middlewares/check_driver')
const {add_cars}=require('../../controllers/parking')
router.post('/add-cars',Auth,add_cars)
module.exports={addCars:router}