require('dotenv').config()
const express =require('express') 
const cors=require('cors')
const cookieSession =require('cookie-session') 
require('express-async-errors')
const fileUpload = require('express-fileupload');
const getCurrentBranchName = require('./utils/getBranchName');

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
//Notifications
const {send_notification}=require('./routes/notification/PushNotification')

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

//Notification
app.use('/api/notifications',send_notification)
app.all('*',()=>{
    throw new notfound('can not find this page please try again')
})
app.use(handelerr)
const start=async()=>{
  
    if(!process.env.JWT_KEY){
        throw new BadReqErr('Jwt is not defined')
    }
    try{
        await mongoose.connect(getCurrentBranchName()!=='main'?process.env.DB_URL_DEV:process.env.DB_URL_PROD)
        console.log(`branch name is ${getCurrentBranchName()}`)
        console.log(`connected to ${getCurrentBranchName()!=='main'?'dev':'prod'} db`)
    }catch (err){
        console.log(err,'err to connect')
    }

    app.listen(port,()=>{
        console.log(`listening in port ${port}`)
    })
}
start()