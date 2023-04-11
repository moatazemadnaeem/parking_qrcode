const express=require('express')
const router=express.Router()
const {Auth}=require('../../middlewares/auth')
// const {checkParking}=require('../../middlewares/check_parking')
const {create_parking}=require('../../controllers/parking')
const {body}=require('express-validator')
const {validatereq}=require('../../middlewares/validateReq')

router.post('/create-parking',Auth,
[
    body('userId').isMongoId().withMessage('userId must be a valid MongoDB ObjectId'),
    body('name').isLength({min:1,max:255}).withMessage('name must be at least 1 chars long and 255 max'),
    body('desc').isLength({min:1,max:10000}).withMessage('desc must be at least 1 chars long and 10000 max'),
    body('fullCapacity').isInt().withMessage('please provide valid fullCapacity'),
    body('location').isObject().withMessage('please provide valid location object').custom((value) => {
        if (!value.lon || !value.lat) {
            return Promise.reject('Location must contain lon and lat properties');
        }
        return Promise.resolve();
    }),
    body('floorCapacity').isInt().withMessage('please provide valid floorCapacity'),
    body('nearest').isArray().withMessage('nearest should be array') .isLength({ min: 1 }).withMessage('nearest must contain atleast 1 element').custom((value, { req }) => {
        //nearest: [  {   place:['hospital','bank'] , distanceToCenter , gate   }  , {   place:['hospital','bank'] , distanceToCenter , gate   }  ]
        for(let i=0;i<value.length;i++){
            const item=value[i];
            if(!item.distanceToCenter||!item.gate||typeof item.distanceToCenter!=='number'||typeof item.gate!=='number'){
                return Promise.reject('Please check nearest elements');
            }
        }
        const sortedNearest=value.sort((a,b)=>a.gate - b.gate)
        let sum=0
        sortedNearest.forEach((item)=>{
            sum+=item.gate;
        })
        if(sum!==((value.length/2)*(sortedNearest[0].gate+sortedNearest[sortedNearest.length-1].gate))){
            return Promise.reject('Gates should start from one to the end');
        }
        req.body.sortedNearest=sortedNearest;
        return Promise.resolve();
    }),
],
validatereq,
create_parking)
module.exports={createParking:router}