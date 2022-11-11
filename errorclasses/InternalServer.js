class InternalServerErr extends Error{
    statusCode=500;
    msg='';
    constructor(msg){
        super(msg)
        this.msg=msg;
        Object.setPrototypeOf(this,InternalServerErr.prototype)
    }
    summary(){
        return [{message:this.msg}]
    }
}
module.exports={InternalServerErr}