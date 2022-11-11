const nodemailer=require('nodemailer')

const SendEmailNotification=(email,msg)=>{

    return new Promise((resolve,reject)=>{
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
            subject:'Please Check This Notification ASAP, Somebody Needs Something From You.',
            text:msg
        }
    
        Transport.sendMail(mailOptions,function(err,res){
            if(err){
                reject(err.message)
            }else{
               resolve('Done Sending...')
            }
        })
    
    })
   
}
module.exports={SendEmailNotification}