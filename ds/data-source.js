var MongoUtil=require('../utils/mongoUtil');
var EnvProvider=require('../utils/env-provider');
class DataSource{

addToCollection(data,isArr=0){

return new Promise((resolve,reject)=>{
    let db=MongoUtil.getDb();

    if(isArr==0){
    db.collection(EnvProvider.getConfig("COL_NAME")).insertOne(data,(err,res)=>{
    
        if(err)reject(err);
        else
        resolve();
    
    });
    }else{
        db.collection(EnvProvider.getConfig("COL_NAME")).insertMany(data,(err,res)=>{
    
            if(err)reject(err);
            else
            resolve();
        
        });
        
    }
    
    
    

})

}

getDataFromDb(query){
let db=MongoUtil.getDb();

return new Promise((resolve,reject)=>{

db.collection(EnvProvider.getConfig("COL_NAME")).find(query).toArray((err,data)=>{

if(err)reject(err);
else
resolve(data);
})

});

}


}

module.exports=new DataSource();
