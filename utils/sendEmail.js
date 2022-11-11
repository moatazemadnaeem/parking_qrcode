const nodemailer=require('nodemailer')

const SendEmail=(email,uniqueString,forgot=false)=>{

    const Transport=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'MoatazWork0@gmail.com',
            pass:process.env.NODEMAILERPASS
        },
    })
    const mailOptions={
        from:'MoatazWork0@gmail.com',
        to:email,
        subject:forgot?`Reset Password`:'Email confirmation',
        text:forgot?`Type this otp in your app ( ${uniqueString} ) to reset your password. Thanks`:
        `Please Press This Link https://qrcodeparking.herokuapp.com/api/users/verfiy-user/${uniqueString} to verify your email. Thanks`
    }
    Transport.sendMail(mailOptions,function(err,res){
        if(err){
            console.log('Error',err)
        }else{
            console.log('Response',res)
        }
    })
}

module.exports={SendEmail}