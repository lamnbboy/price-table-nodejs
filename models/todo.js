var connection = require('../connection');
  
function Todo() {
  this.getGoldPrice = function(res) {
  	res.setHeader('Access-Control-Allow-Origin', '*');

	  // Request methods you wish to allow
  	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  	  // Request headers you wish to allow
  	res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

	//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.acquire(function(err, con) {
      con.query('SELECT * FROM gold_price WHERE id = 1', function(err, result) {
        con.release();
        res.send(result);
      });
    });
  };

  this.getSilverPrice = function(res) {
  	res.setHeader('Access-Control-Allow-Origin', '*');

	  // Request methods you wish to allow
  	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  	  // Request headers you wish to allow
  	res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

	//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    connection.acquire(function(err, con) {
      con.query('SELECT * FROM gold_price WHERE id = 2', function(err, result) {
        con.release();
        res.send(result);
      });
    });
  };

  // this.read = function(id_shop, id_cus, res) {
  // 	res.setHeader('Access-Control-Allow-Origin', '*');

	//   // Request methods you wish to allow
  // 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // 	  // Request headers you wish to allow
  // 	res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

	// //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   connection.acquire(function(err, con) {
  //     con.query('SELECT id_prod FROM favorite_products WHERE id_shop = ? AND id_customer = ?', [id_shop, id_cus], function(err, result) {
  //       con.release();
  //       res.send(result);
  //     });
  //   });
  // };

  // this.create = function(field_data, res) {
  // 	res.setHeader('Access-Control-Allow-Origin', '*');

	//   // Request methods you wish to allow
  // 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // 	  // Request headers you wish to allow
  // 	res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

  //   // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	//   // console.log(field_data);

  //   connection.acquire(function(err, con) {
  //     con.query('INSERT INTO favorite_products(id_prod, id_shop, id_customer) VALUES(?, ?, ?)', [field_data.id_prod, field_data.id_shop, field_data.id_customer], function(err, result) {
  //       con.release();
  //       if (err) {
  //         res.send({status: 'false', message: 'TODO created failed'});
  //       } else {
  //         res.send({status: 'true', message: 'TODO created successfully'});
  //       }
  //     });
  //   });
  // };

  // this.delete = function(field_data, res) {
  // 	res.setHeader('Access-Control-Allow-Origin', '*');

	//   // Request methods you wish to allow
  // 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // 	  // Request headers you wish to allow
  // 	res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

	// //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  //   connection.acquire(function(err, con) {
  //     con.query('delete from favorite_products where id_prod = ? and id_shop = ? and id_customer = ?', [field_data.id_prod, field_data.id_shop, field_data.id_customer], function(err, result) {
  //       con.release();
  //       if (err) {
  //         res.send({status: 'false', message: 'Failed to delete'});
  //       } else {
  //         res.send({status: 'true', message: 'Deleted successfully'});
  //       }
  //     });
  //   });
  // };
}
module.exports = new Todo();