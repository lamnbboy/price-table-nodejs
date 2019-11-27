var todo = require('../models/todo');
  
module.exports = {
  configure: function(app) {
    app.get('/todo/get-gold-price', function(req, res) {
      	todo.getGoldPrice(res);
    });

    app.get('/todo/get-silver-price', function(req, res) {
        todo.getSilverPrice(res);
    });

    // app.get('/todo/get_option/:id_shop', function(req, res) {
    //     todo.getOption(req.params.id_shop, res);
    // });

    // app.get('/todo/read/:id_shop/:id_cus', function(req, res) {
    //   	todo.read(req.params.id_shop, req.params.id_cus, res);
    // });

    // app.post('/todo/create', function(req, res) {
    //     // console.log(req.body);
    //   	todo.create(req.body, res);
    // });

    // app.post('/todo/delete', function(req, res) {
    //   	todo.delete(req.body, res);
    // });

    // app.get('/todo/get_like_prod/:id_shop/:id_prod', function(req, res) {
    //   todo.getLikeOfProd(req.params.id_shop, req.params.id_prod, res);
    // });
  }
};