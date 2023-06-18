const express=require('express')
const router=express.Router()
const {Auth}=require('../../middlewares/auth')
// const {checkDriver}=require('../../middlewares/check_driver')
const {get_parkings}=require('../../controllers/parking')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')
router.get('/get-parkings',Auth,
[
    body('location').optional().isObject().withMessage('please provide valid location object').custom((value) => {
        if (!value.lon || !value.lat) {
            return Promise.reject('Location must contain lon and lat properties');
        }
        return Promise.resolve();
    }),
    body('stars').optional().custom((value)=>{
        if(typeof value!=='number'){
            return Promise.reject('stars must be number')
        }
        return Promise.resolve()
    }).isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('availableCapacity').optional().custom((value)=>{
        if(typeof value!=='number'){
            return Promise.reject('availableCapacity must be number')
        }
        return Promise.resolve()
    }),
    body('userId').optional().isMongoId().withMessage('userId must be a valid MongoDB ObjectId'),
]
,
validatereq
,get_parkings)
module.exports={getParkings:router}