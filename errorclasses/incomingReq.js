class validateincomingreq extends Error{
    statusCode=400;
    errors=[];
    constructor(errors){
        super('something goes wrong with creds')
        this.errors=errors;
        Object.setPrototypeOf(this,validateincomingreq.prototype)
    }
    
    summary(){
        return this.errors.map(err=>{
            return {message:err.msg,field:err.param}
        })
    }
}
module.exports={validateincomingreq}