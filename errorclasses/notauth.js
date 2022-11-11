class NotAuth extends Error{
    statusCode=401;
    msg='';
    constructor(msg){
        super(msg)
        this.msg=msg;
        Object.setPrototypeOf(this,NotAuth.prototype)
    }
    summary(){
        return [{message:this.msg}]
    }
}
module.exports={NotAuth}