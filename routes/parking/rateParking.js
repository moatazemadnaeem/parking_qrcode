const express=require('express')
const router=express.Router()
const {Auth}=require('../../middlewares/auth')
const {rate_parkings}=require('../../controllers/parking')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')
router.post('/rate-parking',Auth,
[
    body('parkingId').isMongoId().withMessage('parkingId must be a valid MongoDB ObjectId'),
    body('stars').custom((value)=>{
        if(typeof value!=='number'){
            return Promise.reject('stars must be number')
        }
        return Promise.resolve()
    }).isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
],
validatereq,
rate_parkings)
module.exports={rateParking:router}