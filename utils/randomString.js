const GetRandString=()=>{
    const len=8;
    let randStr='';
    for(let i=0;i<len;i++){
        //get a random number between 1 to 10
        let ch=Math.floor((Math.random()*10)+1);
        randStr+=ch;
    }
    return new Date().getTime().toString()+randStr;
}
module.exports={GetRandString}