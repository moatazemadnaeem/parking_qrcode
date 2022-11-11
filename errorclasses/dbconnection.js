class dbconnection extends Error{
    dberrmsg='Can not connect with the database';
    statusCode=500;
    constructor(){
        super('please check your internet connection')
        Object.setPrototypeOf(this,dbconnection.prototype)
    }
    summary(){
        return [{message:this.dberrmsg}]
    }
}
module.exports={dbconnection}