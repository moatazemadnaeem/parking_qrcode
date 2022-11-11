class BadReqErr extends Error{
    statusCode=400;
    msg='';
    constructor(msg){
        super(msg)
        this.msg=msg;
        Object.setPrototypeOf(this,BadReqErr.prototype)
    }
    summary(){
        return [{message:this.msg}]
    }
}
module.exports={BadReqErr}