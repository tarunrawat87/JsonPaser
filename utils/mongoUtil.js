
var    MongoClient = require('mongodb').MongoClient;
var EnvProvider=require('../utils/env-provider');
class MongoUtil{
constructor(){
   this.db=null; 
}
    init(emitterObject){
        let object=this;
 
        return new Promise((resolve,reject)=>{
            MongoClient.connect(EnvProvider.getConfig("MONGO_URL"),{ useNewUrlParser: true,useUnifiedTopology: true }, function(err, db) {
                //emitting event after connecting to db
                //TODO

                    object.db=db.db(EnvProvider.getConfig("DB"));
                    if(err){
                        console.log(err);
                        if(emitterObject)emitterObject.emit('failure');
                        reject(err);
                    }
                    else{
                        if(emitterObject)emitterObject.emit('success');
                        resolve();
                    }
                   
                    
              });

        });



    
}

getDb(){
    return this.db;
}

}

module.exports=new MongoUtil;

