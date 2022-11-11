const bcrypt =require('bcrypt-nodejs') 


 const hashPass=(pass)=>{
    const salt = bcrypt.genSaltSync()
    const hashedpassword= bcrypt.hashSync(pass,salt)
    return hashedpassword
}

 const comparePass=(clientpass,dbpass)=>{
    const validate=bcrypt.compareSync(clientpass,dbpass)
    return validate
}

module.exports={
    hashPass,
    comparePass
}