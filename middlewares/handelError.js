const handelerr=(err,req,res,next)=>{
    let transformed;
    let errtransformed;
    transformed=err.summary()
    let msg='';
    transformed.forEach((item,index)=>{
        if(transformed.length-1===index){
            msg+=`(${item.field}): ${item.message}`

        }else{
            msg+=`(${item.field}): ${item.message} And `
        }
    })
    errtransformed={statusCode:err.statusCode,status:false,msg}
    //errtransformed={errors:transformed,statusCode:err.statusCode,status:false,generic_message}
    return res.status(err.statusCode).send(errtransformed)
}
module.exports={handelerr}