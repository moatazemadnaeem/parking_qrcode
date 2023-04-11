require('dotenv').config()
const express =require('express') 
const cors=require('cors')
const cookieSession =require('cookie-session') 
require('express-async-errors')
const fileUpload = require('express-fileupload');

const mongoose =require('mongoose') 
//Auth
const { signup } =require('./routes/signup') 
const { signin } =require('./routes/signin') 
const { signout } =require('./routes/signout') 
const { current } =require('./routes/current-user') 
const {verfiyUserRoute}=require('./routes/verfiy-user')
const {forgot_pass}=require('./routes/forgotPass')
const {send_otp}=require('./routes/send-otp')
const {reset_pass}=require('./routes/reset-pass')
const {resend_otp}=require('./routes/resendOtp')
const {resend_otp_reset}=require('./routes/resendOtpReset')
const {add_profile_pic}=require('./routes/AddprofileImg')
const {updateUser}=require('./routes/update-user')
//Notifications
const {send_notification}=require('./routes/notification/PushNotification')
const {get_chats}=require('./routes/notification/GetChannels')
const {get_chats_user}=require('./routes/notification/GetChatByUser')
//Parking
const {createParking}=require('./routes/parking/create_parking')
const {createSection}=require('./routes/parking/create_section')
const {addCars}=require('./routes/parking/add_cars')
const {removeCars}=require('./routes/parking/remove_cars')
const {getParkings}=require('./routes/parking/getParkings')
const {rateParking}=require('./routes/parking/rateParking')
const { handelerr } =require('./middlewares/handelError') 
const {notfound}=require('./errorclasses/notfound')
const {BadReqErr}=require('./errorclasses/badReq')


const path = require('path')
const app=express()
const port=process.env.PORT||9000
app.use(fileUpload({
    limits: { fileSize: 2 * 1024 * 1024 },
    createParentPath: true
}));
app.use('/static', express.static(path.join(__dirname, 'images')))
//app.set('trust proxy',true)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded());
//first we make the cookie not encrypted 
//one month the cookie will last 
app.use(
    cookieSession({
        signed:false,
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
)

//Auth

app.use('/api/users',signup)
app.use('/api/users',signin)
app.use('/api/users',signout)
app.use('/api/users',current)
app.use('/api/users',verfiyUserRoute)
app.use('/api/users',forgot_pass)
app.use('/api/users',send_otp)
app.use('/api/users',reset_pass)
app.use('/api/users',resend_otp)
app.use('/api/users',resend_otp_reset)
app.use('/api/users',add_profile_pic)
app.use('/api/users',updateUser)

//Notification

app.use('/api/notifications',send_notification)
app.use('/api/notifications',get_chats)
app.use('/api/notifications',get_chats_user)

//Parking

app.use('/api/parking',createParking)
app.use('/api/parking',createSection)
app.use('/api/parking',addCars)
app.use('/api/parking',removeCars)
app.use('/api/parking',getParkings)
app.use('/api/parking',rateParking)

//Catch all

app.all('*',()=>{
    throw new notfound('can not find this page please try again')
})
app.use(handelerr)
const start=async()=>{
  
    if(!process.env.JWT_KEY){
        throw new BadReqErr('Jwt is not defined')
    }
    try{
        await mongoose.connect(process.env.STATE==='DEV'?process.env.DB_URL_DEV:process.env.DB_URL_PROD)
        console.log(`connected to ${process.env.STATE==='DEV'?'dev':'prod'} db`)
    }catch (err){
        console.log(err,'err to connect')
    }

    app.listen(port,()=>{
        console.log(`listening in port ${port}`)
    })
}
start()