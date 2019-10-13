const request = require('request');
var MongoUtil = require('./mongoUtil');
var EventEmitter = require('events').EventEmitter;
var DataSource = require('../ds/data-source');

class DataLoader {

    loadData() {

        return new Promise((resolve, reject) => {

            request('https://s3.amazonaws.com/open-to-cors/assignment.json', {
                json: true
            }, (err, res, body) => {

                if (err) {
                    reject(err);
                    return;
                }


                this.pushToDb(body).then(() => {
                    resolve();
                }).catch((err) => {
                    reject(err);
                });

            });


        })



    }

    pushToDb(data) {

        return new Promise((resolve, reject) => {
            MongoUtil.init(new EventEmitter()).then(() => {

                let db = MongoUtil.getDb();

                if (db) {
                    let products = data.products;
                    let productsArr = [];
                    Object.keys(products).forEach((ele) => {
                        let obj = {};
                        obj._id = ele;
                        obj.title = products[ele].title;
                        obj.price = products[ele].price;
                        obj.popularity = products[ele].popularity;
                        productsArr.push(obj);
                    })

                    DataSource.addToCollection(productsArr, 1).then(() => {
                        resolve();
                    }).catch((err) => {
                        reject();
                    });


                }


            }).catch((err) => {
                reject();
            });

        });







    }

}

module.exports = new DataLoader;