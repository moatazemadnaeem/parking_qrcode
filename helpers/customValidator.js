const joi=require('@hapi/joi')


const ValidateReq=(data)=>{
    const {name,email,password}=data
    if(name&&email===undefined&&password===undefined){
        const schema=joi.object({
            name:joi.string().trim().min(3).max(255),
            // email:joi.string().email(),
            // password:joi.string().trim().min(6).max(255)
        }
        )
        return schema.validate({name})
    }
    else if(email&&name===undefined&&password===undefined){
        const schema=joi.object({
            //name:joi.string().trim().min(3).max(255),
            email:joi.string().email(),
            // password:joi.string().trim().min(6).max(255)
        }
        )
        return schema.validate({email})
    }
    else if(password&&email===undefined&&name===undefined){
        const schema=joi.object({
            //name:joi.string().trim().min(3).max(255),
            //email:joi.string().email(),
             password:joi.string().trim().min(6).max(255)
        }
        )
        return schema.validate({password})
    }
    else if(name!==undefined&&email!==undefined&&password===undefined){
        const schema=joi.object({
            name:joi.string().trim().min(3).max(255),
            email:joi.string().email(),
            // password:joi.string().trim().min(6).max(255)
        }
        )
        return schema.validate({name,email})
    }
  
    else if(name!==undefined&&password!==undefined&&email===undefined){
        const schema=joi.object({
            name:joi.string().trim().min(3).max(255),
            //email:joi.string().email(),
            password:joi.string().trim().min(6).max(255)
        }
        )
        return schema.validate({name,password})
    }
  
  
    else if(email!==undefined&&password!==undefined&&name===undefined){
        const schema=joi.object({
            //name:joi.string().trim().min(3).max(255),
            email:joi.string().email(),
            password:joi.string().trim().min(6).max(255)
        }
        )
        return schema.validate({email,password})
    }else{
        const schema=joi.object({
            name:joi.string().trim().min(3).max(255),
            email:joi.string().email(),
            password:joi.string().trim().min(6).max(255)
        }
        )
        return schema.validate(data)
    }
  

  
}


module.exports ={ValidateReq}
