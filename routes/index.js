const express = require('express');
const router = express.Router();
const session = require('express-session');
const request = require('request-promise');
const app = express();
const Store = require('data-store');
const store = new Store({ path: 'config.json' });

const mysql = require('mysql');

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "price_table"
});

var timer;

/* GET home page. */
router.get('/', function(req, res, next) {

    const shop = req.query.shop;

    var full_url = req.protocol + '://' + req.get('host') + req.originalUrl;

    var verify = store.get("verify");

    // var url_api_gold = "https://xml.dgcsc.org/xml.cfm?password=trial&action=goldjb";
    var url_api_gold = "http://goldpricez.com/api/rates/currency/usd/measure/gram";

    request({
        url: url_api_gold,
        headers: {'x-api-key' : 'f4f691ae9cb382b2dbe0fc84bd6c651bf4f691ae'},
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            //   console.log(JSON.parse(body).gram_in_usd); // Print the json response
            var price_gold = JSON.parse(body).gram_in_usd;

            //   console.log(price_gold);

            // var sql = "UPDATE gold_price SET value = " + price_gold + " WHERE id = 1";
            var sql = "SELECT value FROM gold_price WHERE id = 1";
            conn.query(sql, function(err, results) {
                if (err) throw err;
                var diff = price_gold - results[0].value;
                console.log(diff);

                var sql_price = "UPDATE gold_price SET value = " + price_gold + " WHERE id = 1";
                conn.query(sql_price, function(err, results1) {
                    if (err) throw err;
                    console.log("success update today price of gold");
                });

                var sql_diff = "UPDATE related_diffrence SET value = " + diff + " WHERE id_metal = 1";
                conn.query(sql_diff, function(err, results1) {
                    if (err) throw err;
                    console.log("success update related diffrence of price of gold");
                });

                const shopRequestUrl = 'https://' + verify.shop + '/admin/api/2019-07/products.json?product_type=ring';

                request({url: shopRequestUrl, json: true, headers: verify.header}, function(err, response, result) {
                    if (err) {
                    throw err;
                    }
                    // console.log(result.products.length);
                    for (var i = 0; i < result.products.length; i++) {

                        const putRequestUrl = 'https://' + verify.shop + '/admin/api/2019-07/products/' + result.products[i].id +'.json';

                        const edit_product = {
                            "product":
                                {
                                    "id": result.products[i].id,
                                    "variants": [],
                                }
                        };

                        for(var j = 0; j < result.products[i].variants.length; j++){
                            // console.log(result.products[i].variants[j].option1 + " - " + result.products[i].variants[j].option2);
            
                            if(result.products[i].variants[j].option2.toLocaleLowerCase() == "gold"){

                                var element = {};

                                element.id = result.products[i].variants[j].id;
                                element.inventory_quantity = parseInt(result.products[i].variants[j].inventory_quantity);

                                var weight_unit = result.products[i].variants[j].weight_unit;
                                var weight = 0.0;
                                if(weight_unit == 'lb'){
                                    weight = parseFloat(result.products[i].variants[j].weight) * 453.59;
                                }else if(weight_unit == 'oz'){
                                    weight = parseFloat(result.products[i].variants[j].weight) * 28.35;
                                }else if(weight_unit == 'kg'){
                                    weight = parseFloat(result.products[i].variants[j].weight) * 1000;
                                }else if(weight_unit == 'g'){
                                    weight = parseFloat(result.products[i].variants[j].weight);
                                }

                                // VD điều kiện cập nhật giá : new_sp có phần thập phân == 0.00 ||| old_sp ngược lại
                                var num_price = parseFloat(result.products[i].variants[j].price) - parseInt(result.products[i].variants[j].price);
                                // console.log("điều kiện: " + num_price);

                                if(num_price.toFixed(2) != 0.00){
                                    // old_sp : cập nhật giá theo sự chênh lệch giá vàng gần nhất
                                    element.price = parseFloat(result.products[i].variants[j].price) + parseFloat(diff)*weight;
                                }else{
                                    // new_sp : cập nhật giá theo giá vàng gần nhất
                                    element.price = parseFloat(result.products[i].variants[j].price) + parseFloat(price_gold)*weight;
                                }

                                edit_product.product.variants.push(element);
                            }else{
                                var element = {};

                                element.id = result.products[i].variants[j].id;
                                element.inventory_quantity = parseInt(result.products[i].variants[j].inventory_quantity);

                                var weight_unit = result.products[i].variants[j].weight_unit;
                                var weight = 0.0;
                                if(weight_unit == 'lb'){
                                    weight = parseFloat(result.products[i].variants[j].weight) * 453.59;
                                }else if(weight_unit == 'oz'){
                                    weight = parseFloat(result.products[i].variants[j].weight) * 28.35;
                                }else if(weight_unit == 'kg'){
                                    weight = parseFloat(result.products[i].variants[j].weight) * 1000;
                                }else if(weight_unit == 'g'){
                                    weight = parseFloat(result.products[i].variants[j].weight);
                                }

                                element.price = parseFloat(result.products[i].variants[j].price);

                                edit_product.product.variants.push(element);
                            }
                        }

                        console.log(edit_product.product);

                        const options = {
                            method: 'PUT',
                            uri: putRequestUrl,
                            json: true,
                            resolveWithFullResponse: true,//added this to view status code
                            headers: verify.header,
                            body: edit_product //pass new product object - NEW - request-promise problably updated
                        };
        
                        request(options)
                        .then((response) => {
                            // res.end("Updated success gold price of product");
                            // res.render('index', { title: 'Updated success Gold price of Product' , fullurl : full_url });
                            console.log('Updating gold price of product ...');
                        })
                        .catch((error) => {
            
                            console.log("fas");
                            return -1;
                        });
                    }

                    res.render('index', { title: 'Updated success Gold price of Product' , fullurl : full_url });

                });
            });
        }
    });

    timer = setInterval(function() {

        request({
            url: url_api_gold,
            headers: {'x-api-key' : 'f4f691ae9cb382b2dbe0fc84bd6c651bf4f691ae'},
            json: true
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                //   console.log(JSON.parse(body).gram_in_usd); // Print the json response
                var price_gold = JSON.parse(body).gram_in_usd;

                //   console.log(price_gold);

                // var sql = "UPDATE gold_price SET value = " + price_gold + " WHERE id = 1";
                var sql = "SELECT value FROM gold_price WHERE id = 1";
                conn.query(sql, function(err, results) {
                    if (err) throw err;
                    var diff = price_gold - results[0].value;
                    console.log(diff);

                    var sql_price = "UPDATE gold_price SET value = " + price_gold + " WHERE id = 1";
                    conn.query(sql_price, function(err, results1) {
                        if (err) throw err;
                        console.log("success update today price of gold");
                    });

                    var sql_diff = "UPDATE related_diffrence SET value = " + diff + " WHERE id_metal = 1";
                    conn.query(sql_diff, function(err, results1) {
                        if (err) throw err;
                        console.log("success update related diffrence of price of gold");
                    });

                    const shopRequestUrl = 'https://' + verify.shop + '/admin/api/2019-07/products.json?product_type=ring';

                    request({url: shopRequestUrl, json: true, headers: verify.header}, function(err, response, result) {
                        if (err) {
                        throw err;
                        }
                        // console.log(result.products.length);
                        for (var i = 0; i < result.products.length; i++) {

                            const putRequestUrl = 'https://' + verify.shop + '/admin/api/2019-07/products/' + result.products[i].id +'.json';

                            const edit_product = {
                                "product":
                                    {
                                        "id": result.products[i].id,
                                        "variants": [],
                                    }
                            };

                            for(var j = 0; j < result.products[i].variants.length; j++){
                                // console.log(result.products[i].variants[j].option1 + " - " + result.products[i].variants[j].option2);
                
                                if(result.products[i].variants[j].option2.toLocaleLowerCase() == "gold"){

                                    var element = {};

                                    element.id = result.products[i].variants[j].id;
                                    element.inventory_quantity = parseInt(result.products[i].variants[j].inventory_quantity);

                                    var weight_unit = result.products[i].variants[j].weight_unit;
                                    var weight = 0.0;
                                    if(weight_unit == 'lb'){
                                        weight = parseFloat(result.products[i].variants[j].weight) * 453.59;
                                    }else if(weight_unit == 'oz'){
                                        weight = parseFloat(result.products[i].variants[j].weight) * 28.35;
                                    }else if(weight_unit == 'kg'){
                                        weight = parseFloat(result.products[i].variants[j].weight) * 1000;
                                    }else if(weight_unit == 'g'){
                                        weight = parseFloat(result.products[i].variants[j].weight);
                                    }

                                    // VD điều kiện cập nhật giá : new_sp có phần thập phân == 0.00 ||| old_sp ngược lại
                                    var num_price = parseFloat(result.products[i].variants[j].price) - parseInt(result.products[i].variants[j].price);
                                    // console.log("điều kiện: " + num_price);

                                    if(num_price.toFixed(2) != 0.00){
                                        // old_sp : cập nhật giá theo sự chênh lệch giá vàng gần nhất
                                        element.price = parseFloat(result.products[i].variants[j].price) + parseFloat(diff)*weight;
                                    }else{
                                        // new_sp : cập nhật giá theo giá vàng gần nhất
                                        element.price = parseFloat(result.products[i].variants[j].price) + parseFloat(price_gold)*weight;
                                    }

                                    edit_product.product.variants.push(element);
                                }else{
                                    var element = {};

                                    element.id = result.products[i].variants[j].id;
                                    element.inventory_quantity = parseInt(result.products[i].variants[j].inventory_quantity);

                                    var weight_unit = result.products[i].variants[j].weight_unit;
                                    var weight = 0.0;
                                    if(weight_unit == 'lb'){
                                        weight = parseFloat(result.products[i].variants[j].weight) * 453.59;
                                    }else if(weight_unit == 'oz'){
                                        weight = parseFloat(result.products[i].variants[j].weight) * 28.35;
                                    }else if(weight_unit == 'kg'){
                                        weight = parseFloat(result.products[i].variants[j].weight) * 1000;
                                    }else if(weight_unit == 'g'){
                                        weight = parseFloat(result.products[i].variants[j].weight);
                                    }

                                    element.price = parseFloat(result.products[i].variants[j].price);

                                    edit_product.product.variants.push(element);
                                }
                            }

                            console.log(edit_product.product);

                            const options = {
                                method: 'PUT',
                                uri: putRequestUrl,
                                json: true,
                                resolveWithFullResponse: true,//added this to view status code
                                headers: verify.header,
                                body: edit_product //pass new product object - NEW - request-promise problably updated
                            };
            
                            request(options)
                            .then((response) => {
                                // res.end("Updated success gold price of product");
                                // res.render('index', { title: 'Updated success Gold price of Product' , fullurl : full_url });
                                console.log('Updating gold price of product ...');
                            })
                            .catch((error) => {
                
                                console.log("fas");
                                return -1;
                            });
                        }
                    });
                });
            }
        });

    }, 60000);
});

router.get('/stop-update-gp', function(req, res, next) {
    res.end("The updating gold price is turned off.......");
    clearInterval(timer);
});

module.exports = router;
