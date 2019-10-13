var DataSource=require('../ds/data-source')
var DataLayer=require('../ds/data-layer');
class ProductController{

    
   getProducts(query){
   
    return new Promise((resolve,reject)=>{
        try{
            let result=DataLayer.getProducts(query);
            resolve(result); 
        }catch(err){
            reject(err);
        }
       
    });

   } 
    

}

module.exports=new ProductController();