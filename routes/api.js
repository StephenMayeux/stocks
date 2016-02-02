var express = require('express');
var router = express.Router();
var Quandl = require('quandl');
var Stock = require('../models/stock');
var mongoose = require('mongoose');
var moment = require('moment');

var quandl = new Quandl({
  auth_token: 'Wygwb7Xp33xj2NSe9-sL',
  api_version: 3
});

router.get('/:stock', function(req, res, next) {

  function getStocks(callback) {
    quandl.dataset({
      source: 'WIKI',
      table: req.params.stock
      },
      {
        order: 'asc',
        exclude_column_names: true,
        start_date: moment().subtract(3, 'months').format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
        column_index: 4
      }, function(err, response) {
      if (err) {throw err;}
      callback(response);
    });
  }

  getStocks(function(response) {
    var body = JSON.parse(response);
    var rawData = body.dataset.data;
    var dates = [];
    var prices = [];
    rawData.forEach(function(item) {
      dates.push(item[0]);
      prices.push(item[1]);
    });
    if (body.quandl_error) {
      res.send('This stock symbol does not exist in the Quandl Database.');
    } else {
      var newStock = new Stock({
        name: body.dataset.dataset_code,
        dates: dates,
        prices: prices
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
