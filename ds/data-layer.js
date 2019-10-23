var DataSource = require('./data-source');

class DataLayer {

    constructor() {
        this.map = new Map();
        this.productsArr = [];
    }

    loadDatafromDb() {
        let me = this;
        return new Promise((resolve, reject) => {

            DataSource.getDataFromDb({}).then((result) => {
                me.productsArr = result;

                try {
                    me.createDataStructure();
                } catch (err) {
                    reject(err);
                }
                resolve();

            }).catch((err) => {
                reject(err);
            })


        })


    }
    /*
    will create necessary data structure
    for app
    */
    createDataStructure() {
        let me = this;
        let index = 0;
        me.productsArr.forEach((ele) => {

            let keywords = ele.title.toLowerCase().trim().split(" ");

           let i=1;     
            let substrings=keywords[0];
            let str=substrings+" ";
            while(i<keywords.length){
                str+=keywords[i];
               // console.log(str)
                if (me.map.has(str)) {
                    let set = me.map.get(str);
                    set.add(index);
                    me.map.set(str, set);
                } else {
                    let set = new Set();
                    set.add(index);
                    me.map.set(str, set);

                }
               str+=(keywords.length-1==i?"":" ");
             i++;   
            }

            if (keywords) {

                keywords.forEach((keyword) => {

                    if (me.map.has(keyword)) {
                        let set = me.map.get(keyword);
                        set.add(index);
                        me.map.set(keyword, set);
                    } else {
                        let set = new Set();
                        set.add(index);
                        me.map.set(keyword, set);

                    }

                });
                
                
                if (me.map.has(ele.title.toLowerCase())) {
                    let set = me.map.get(ele.title.toLowerCase());
                    set.add(index);
                    me.map.set(ele.title.toLowerCase(), set);
                } else {
                    let set = new Set();
                    set.add(index);
                    me.map.set(ele.title.toLowerCase(), set);

                }
                    
            }
            index++;
        });
     //   console.log(me.map)
    }
    /* 
    will parse query and will get products
    */
    getProducts(query) {
        let me = this;
        let contaninsAND = query.includes("and");
        let containsOR = query.includes("or");
        let containsBELOW = query.includes("below");
        let containsABOVE = query.includes("above");
        let resultSet;
        let startsWithAoveORBelow=query.startsWith("above")||query.startsWith("below");
        if(startsWithAoveORBelow){
            let limit=parseInt(query.split(" ")[1]);
            let startsWithAbove=query.startsWith("above");
            
            if(startsWithAbove){
                resultSet = me.filterResult(-1, limit, me.productsArr);
            }else{
                resultSet = me.filterResult(1, limit, me.productsArr);
            }
            return resultSet;
        }

         if(me.conatainsMultipeANDOR(query)){
            
            if(me.containsMultipleAND(query)){
              let andQuery=  query.split(" above ")[0].split(" below ")[0];
                resultSet=me.getMultipleANDResult(andQuery);
            }else{
                if(me.containsMultipleOR(query)){
                     let orQuery=  query.split(" above ")[0].split(" below ")[0];
                    resultSet=me.getMultipleORResult(orQuery);
       
                }else{
                  return [];  
                }

            }
            
            if(containsABOVE){
                let limit= query.split(" above ")[1];
                resultSet= me.filterResult(-1, parseInt(limit), resultSet);
            }else{
               if(containsBELOW){
                let limit=query.split(" below ")[1];
                resultSet= me.filterResult(1, parseInt(limit), resultSet);
               } 
            }

            resultSet.sort((a,b)=>{
                return parseInt(b.popularity)-parseInt(a.popularity);
            });    
            return resultSet;
         }   

        if (contaninsAND || containsOR) {

            if (contaninsAND) {
                resultSet = me.getANDResult(query);
            } else {
                resultSet = me.getORResult(query);
            }

        } else {
            resultSet = me.getResult(query);
        }

        if (containsABOVE || containsBELOW) {
            let limit;
            if (containsABOVE) {
                limit = query.split(" above ")[1];

                resultSet = me.filterResult(-1, parseInt(limit), resultSet);
            } else {
                limit = query.split(" below ")[1];
                resultSet = me.filterResult(1, parseInt(limit), resultSet);
            }
            
            
       
       
        }


        resultSet.sort((a,b)=>{
            return parseInt(b.popularity)-parseInt(a.popularity);
        });

        return resultSet;
    }
/*get result when query contans AND keyword*/
    getANDResult(query) {
        let keyword = query.split(" above ")[0].split(" below ")[0].split(" and ");
        let result = [];
        let products1, products2;
        //checking if first word is valid keyword
        if (this.map.has(keyword[0])) {
            products1 = Array.from(this.map.get(keyword[0]));
        } else {
            products1 = [];
        }
        if (this.map.has(keyword[1])) {
            products2 = Array.from(this.map.get(keyword[1]));
        } else {
            products2 = [];
        }

        //intersection of two array for and condition
        products1 = products2.filter((ele) => {
            //  console.log(products1);
            return products1.indexOf(ele) !== -1;
        });


        products1.forEach((index) => {
            result.push(this.productsArr[index]);
        })

       

        return result;
    }

    /*
    when result only contains Title
    */
    getResult(query) {
        let keyword = query.split(" above ")[0].split(" below ")[0];
        let result = [];
        //if the keyword is not present in any title
        //console.log(query);
        if (this.map.has(keyword) == false) {
            return result;
        }
        
      
        let indexes = Array.from(this.map.get(keyword));
        console.log(indexes);
        indexes.forEach((index) => {
            result.push(this.productsArr[index]);
        })
        return result;
    }

    /*when query contains OR*/
    getORResult(query) {

        let keyword = query.split(" above ")[0].split(" below ")[0].split(" or ");

        let result = [];
        let products1, products2;
        //checking if first word is valid keyword
        if (this.map.has(keyword[0])) {
            products1 = Array.from(this.map.get(keyword[0]));
        } else {
            products1 = [];
        }
        if (this.map.has(keyword[1])) {
            products2 = Array.from(this.map.get(keyword[1]));
        } else {
            products2 = [];
        }
        let set = new Set(products1.concat(products2));

        set.forEach((index) => {
            result.push(this.productsArr[index]);
        })

        return result;
    }
/*when result get multiple AND*/
    getMultipleANDResult(query){
        let result=[];
        let keywords=query.split(" and ");
        let indexes= Array.from(this.map.get(keywords[0]));
        let i=1;
        let product1=indexes,product2;
        while(i<keywords.length){
         product2=Array.from(this.map.get(keywords[i]));
          product1=product2.filter((ele)=>{
            return product1.indexOf(ele)!=-1;
          })  
         
        i++;
        }
            product1.forEach((index) => {
            result.push(this.productsArr[index]);
        })
        return result;


    }

    getMultipleORResult(query){
        let result=[];
        let keywords=query.split(" or ");
        let i=0;
        let indexes=[];
        let product;
        while(i<keywords.length){
           indexes= indexes.concat(Array.from(this.map.get(keywords[i])));
         
        i++;
        }
        product=new Set(indexes);    
      //  console.log(product)
        product.forEach((index) => {
            result.push(this.productsArr[index]);
        })
        //console.log();
        //console.log(result);
        return result;

    }


    conatainsMultipeANDOR(query){
        if(!(query.includes("and")||query.includes("or"))) return false;
        
         if(query.split(" and ").length>=3){
            return true;
         }else{
            if(query.split(" or ").length>=3){
             return true;
            }else{
             return false;   
            }

         }
            

    }

containsMultipleAND(query){
    return query.includes("or")==false;
}
containsMultipleOR(query){
    return query.includes("and")==false;
}

    /*will filter result with given limit*/
    filterResult(limitType, limit, arr) {
        //console.log(arr);

        if (limitType == 1) {
            arr = arr.filter((ele) => {
                //console.log(ele.price);
                return parseInt(ele.price) < limit
            })
        } else {
            arr = arr.filter((ele) => {
                //console.log(ele.price);
                return parseInt(ele.price) > limit;
            })
        }
        return arr;
    }

    
}
module.exports = new DataLayer();