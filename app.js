var express=require('express');
var app=express();
var DataLayer=require('./ds/data-layer');
var MongoUtil=require('./utils/mongoUtil')
var ProductRoute=require('./routes/product-route');
var cors=require('cors');
var EnvProvider=require('./utils/env-provider');
app.use(cors());
MongoUtil.init(app);
//this will be invoked on successfully connection to db

app.on('success',()=>{

    DataLayer.loadDatafromDb().then(()=>{
        console.log('app data structure loaded !');
        registerRoutes();
        app.listen(EnvProvider.getConfig("PORT"),()=>{
            console.log('app is listening to '+EnvProvider.getConfig("PORT"));
        });
    }).catch((err)=>{
     console.log(err);   
    })
    






});

app.on('failure',()=>{
    console.log('app is termincating..!');
});

function registerRoutes(){
app.use('/',ProductRoute);
}
