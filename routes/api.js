var express = require('express');
var router = express.Router();
var Quandl = require('quandl');
var Stock = require('../models/stock');
var mongoose = require('mongoose');

var quandl = new Quandl({
  auth_token: 'Wygwb7Xp33xj2NSe9-sL',
  api_version: 3,
  order: 'asc',
  exclude_column_names: true,
  start_date: '2015-01-30',
  end_date: '2016-01-29',
  column_index: 4
});

router.get('/:stock', function(req, res, next) {

  function getStocks(callback) {
    quandl.dataset({source: 'WIKI', table: req.params.stock}, function(err, response) {
      if (err) {throw err;}
      callback(response);
    });
  }

  getStocks(function(response) {
    var body = JSON.parse(response);
    if (body.quandl_error) {
      res.send('This does not exist');
    } else {
      var newStock = new Stock({
        name: body.dataset.dataset_code
      });
      Stock.saveStock(newStock, function(err, doc) {
        if (err) throw err;
      });
      Stock.findStocks(function(err, docs) {
        if (err) throw err;
        res.send(docs);
      });
    }
  });



});

module.exports = router;
