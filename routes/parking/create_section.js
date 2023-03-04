const express=require('express')
const router=express.Router()
const {Auth}=require('../../middlewares/auth')
// const {checkParking}=require('../../middlewares/check_parking')
const {create_section}=require('../../controllers/parking')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')
router.post('/create-section',Auth,
[
    body('capacity').isInt().withMessage('please provide valid capacity'),
    body('sectionChar').isLength({ min: 1, max: 1 }) .withMessage('sectionChar must be exactly 1 character long'),
    body('id').isMongoId().withMessage('ID must be a valid MongoDB ObjectId')
],
validatereq
,create_section)
module.exports={createSection:router}