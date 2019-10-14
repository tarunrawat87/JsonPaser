

class EnvProvider{
constructor(){
this.keyValues=require('../configurations/config.json');    
//console.log(this.keyValues);
}
    getConfig(key){
        return this.keyValues[key];
         
    }
    
}

module.exports=new EnvProvider();