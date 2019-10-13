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

            let keywords = ele.title.trim().split(" ");

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
                
                
                if (me.map.has(ele.title)) {
                    let set = me.map.get(ele.title);
                    set.add(index);
                    me.map.set(ele.title, set);
                } else {
                    let set = new Set();
                    set.add(index);
                    me.map.set(ele.title, set);

                }
                    
            }
            index++;
        });
    }
    /* 
    will parse query and will get products
    */
    getProducts(query) {
        let me = this;
        let contaninsAND = query.includes("AND");
        let containsOR = query.includes("OR");
        let containsBELOW = query.includes("BELOW");
        let containsABOVE = query.includes("ABOVE");
        let resultSet;
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
                limit = query.split(" ABOVE ")[1];

                resultSet = me.filterResult(-1, parseInt(limit), resultSet);
            } else {
                limit = query.split(" BELOW ")[1];
                resultSet = me.filterResult(1, parseInt(limit), resultSet);
            }
        }




        return resultSet;
    }

    getANDResult(query) {
        let keyword = query.split(" ABOVE ")[0].split(" BELOW")[0].split(" AND ");
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
        let keyword = query.split(" ABOVE ")[0].split(" BELOW ")[0];

        let result = [];
        //if the keyword is not present in any title
        if (this.map.has(keyword) == false) {
            return result;
        }

        let indexes = Array.from(this.map.get(keyword));
        indexes.forEach((index) => {
            result.push(this.productsArr[index]);
        })
        return result;
    }

    /*when query contains OR*/
    getORResult(query) {

        let keyword = query.split(" ABOVE ")[0].split(" BELOW ")[0].split(" OR ");

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