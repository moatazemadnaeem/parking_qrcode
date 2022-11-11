const express=require('express')
const {pushNotification}=require('../../controllers/notification.js')
const {Auth} =require('../../middlewares/auth')


const router=express.Router()

router.post('/send_notification',Auth,pushNotification)
module.exports={send_notification:router}