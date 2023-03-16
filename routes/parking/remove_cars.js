const express=require('express')
const router=express.Router()
const {Auth}=require('../../middlewares/auth')
// const {checkDriver}=require('../../middlewares/check_driver')
const {remove_cars}=require('../../controllers/parking')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')
router.delete('/remove-cars',Auth,[
    body('carId').isMongoId().withMessage('carId must be a valid MongoDB ObjectId'),
    body('id').isMongoId().withMessage('ID must be a valid MongoDB ObjectId'),
    body('location').isObject().withMessage('please provide valid location object').custom((value) => {
        if (!value.lon || !value.lat) {
            return Promise.reject('Location must contain lon and lat properties');
        }
        return Promise.resolve();
    }),
    body('outGate').isInt().withMessage('please provide valid outGate'),

],
validatereq,remove_cars)
module.exports={removeCars:router}