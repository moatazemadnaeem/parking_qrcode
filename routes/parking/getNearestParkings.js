const express=require('express')
const router=express.Router()
const {Auth}=require('../../middlewares/auth')
// const {checkDriver}=require('../../middlewares/check_driver')
const {get_nearest_parkings}=require('../../controllers/parking')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')
router.get('/get-nearest-parkings',Auth,
[
    body('location').isObject().withMessage('please provide valid location object').custom((value) => {
        if (!value.lon || !value.lat) {
            return Promise.reject('Location must contain lon and lat properties');
        }
        return Promise.resolve();
    }),
]
,
validatereq
,get_nearest_parkings)
module.exports={getNearestParkings:router}