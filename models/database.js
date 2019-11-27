const express = require('express');

var app = express();
app.listen(4000,function(){
    console.log('Node server running @ http://localhost:3000')
});
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "favorite_shoify"
});

module.exports = con;