const express=require('express')
const {current}=require('../controllers/auth')
const {ExtractPayload}=require('../middlewares/extractPayload')
const router=express.Router()

router.get('/current-user',ExtractPayload,current)
module.exports={current:router}