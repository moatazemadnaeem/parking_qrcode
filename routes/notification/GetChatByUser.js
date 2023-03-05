const express=require('express')
const router=express.Router()
const {Auth}=require('../../middlewares/auth')
const {getChatsByUser}=require('../../controllers/notification')
const {validatereq}=require('../../middlewares/validateReq')
const {body}=require('express-validator')

router.post('/get-chats-user',Auth,
[
    body('chatUserId').isMongoId().withMessage('chatUserId must be a valid MongoDB ObjectId'),
],
validatereq
,getChatsByUser)
module.exports={get_chats_user:router}