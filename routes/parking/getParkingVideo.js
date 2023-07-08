const express=require('express')
const router=express.Router()
const {Auth}=require('../../middlewares/auth')
// const {checkDriver}=require('../../middlewares/check_driver')
const {getParkingVideo}=require('../../controllers/parking')
// const {body}=require('express-validator')
// const {validatereq}=require('../../middlewares/validateReq')
router.get('/get-parking-video',Auth
,getParkingVideo)
module.exports={getParkingVideo:router}