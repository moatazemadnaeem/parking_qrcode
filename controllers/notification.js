const {BadReqErr}=require('../errorclasses/badReq')
const {notfound}=require('../errorclasses/notfound')
const {SendEmailNotification}=require('../utils/sendEmailNotification')
const {user}=require('../models/BaseModel')
module.exports={
    pushNotification:async(req,res)=>{
        const {email,msg}=req.body
        try{
            const id=req.currentUser.id
            const sender=await user.findById(id)
            //this email is got by qrcode
            const receiver=await user.findOne({email})
            if(!receiver){
                throw new notfound('Can not find this email.')
            }
            if(!receiver.IsValid){
                throw new notfound('The email that you are trying to send the message is not verified.')
            }
            if(!sender){
                throw new notfound('Can not find the user that trying to send.')
            }
            sender.notifications.push({msg,sender:id,receiver:receiver._id})
            receiver.notifications.push({msg,sender:id,receiver:receiver._id})
            await sender.save()
            await receiver.save()
            await SendEmailNotification(email,msg)//push notification email
            return res.status(201).send({msg:'Notification Sent Successfully...',status:true})

        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    getChats:async(req,res)=>{
        try{
            const id=req.currentUser.id
            const User=await user.findById(id)
            if(!User){
                throw new notfound('Can not find the user please try again.')
            }
            let channels=[]
            console.log(User.notifications)
            for(let i=0;i<User.notifications.length;i++){
                const item=User.notifications[i]
                const {sender,receiver}=item;

                if(sender.toString()===id&&channels.indexOf(receiver.toString())===-1){
                    //receiver its the person
                    channels.push(receiver.toString())
                    continue;
                }
                if(receiver.toString()===id&&channels.indexOf(sender.toString())===-1){
                    //sender its the person
                    channels.push(sender.toString())
                    continue;
                }
            }
            const chats = [];
            for(let j=0;j<channels.length;j++){
                const id=channels[j]
                const chatUser= await user.findById(id).select('name email')
                if(chatUser){
                    chats.push(chatUser)
                }
            }
            return res.status(200).send({msg:'Chats Fetched Successfully...',chats,status:true})
        }catch(err){
            throw new BadReqErr(err.message)
        }
    },
    getChatsByUser:async(req,res)=>{
        const {chatUserId}=req.body
        try{
            const id=req.currentUser.id
            const User=await user.findById(id)
            if(!User){
                throw new notfound('Can not find the user please try again.')
            }
            const messages=[]
            console.log(User)
            for(let i=0;i<User.notifications.length;i++){
               const item=User.notifications[i];
               console.log(item)
               const members=[item.sender.toString(),item.receiver.toString()]
               console.log(members)
               if(members.includes(chatUserId)&&members.includes(id)){
                //this means we found the item or the message 
                messages.push({msg:item.msg,sender:item.sender.toString(),receiver:item.receiver.toString()})
               }
            }
            const oldestMessages=messages.sort((a, b) => a.createdAt - b.createdAt);
            return res.status(200).send({msg:'Chat Fetched Successfully...',Messages:oldestMessages,status:true})

        }catch(err){
            throw new BadReqErr(err.message)
        }
    }
}