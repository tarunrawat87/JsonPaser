var express=require('express');
var router=express.Router();
var bodyParser=require('body-parser');
var ProductController=require('../controller/product-controller');

router.use(bodyParser.json());
//router.use(bodyParser.urlencoded({ extended: true }))
router.use('/',express.static('./ui/JSONParser/dist/JSONParser'));
router.post('/find',(req,res)=>{
var query=req.body.query;
console.log(query);

ProductController.getProducts(query).then((result)=>{
res.send(result);
}).catch((err)=>{
    console.log(err);
res.status('500').send({"ok":-1});
});


});


module.exports=router;