const express=require('express')
const router=express.Router()
const {Auth}=require('../../middlewares/auth')
// const {checkDriver}=require('../../middlewares/check_driver')
const {add_cars}=require('../../controllers/parking')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')
router.post('/add-cars',Auth,
[
    body('carId').isMongoId().withMessage('carId must be a valid MongoDB ObjectId'),
    body('id').isMongoId().withMessage('ID must be a valid MongoDB ObjectId'),
    body('location').isObject().withMessage('please provide valid location object').custom((value) => {
        if (!value.lon || !value.lat) {
            return Promise.reject('Location must contain lon and lat properties');
        }
        return Promise.resolve();
    }),
    body('enterGate').isInt().withMessage('please provide valid enterGate'),

],
validatereq,
add_cars)
module.exports={addCars:router}