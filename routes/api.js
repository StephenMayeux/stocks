// REQUIRED MODULES ============================================================
var express = require('express');
var router = express.Router();
var Quandl = require('quandl');
var Stock = require('../models/stock');
var mongoose = require('mongoose');
var moment = require('moment');

// QUANDL STOCK MARKET API SET UP ==============================================
var quandl = new Quandl({
  auth_token: 'Wygwb7Xp33xj2NSe9-sL',
  api_version: 3
});

// ADDING A NEW STOCK SYMBOL ===================================================
router.get('/:stock', function(req, res, next) {

  // FETCHING QUANDL API DATA AND SENDING TO CALLBACK ==========================
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

  // CALLBACK ==================================================================
  getStocks(function(response) {
    // DATA FROM QUANDL API
    var body = JSON.parse(response);
    var rawData = body.dataset.data;
    var dates = [];
    var prices = [];
    var chartData = {};
    chartData.datasets = [];
    // SAVE DATES AND CLOSING STOCK PRICES IN SEPERATE ARRAYS
    rawData.forEach(function(item) {
      dates.push(item[0]);
      prices.push(item[1]);
    });
    // IF QUANDL CAN'T FIND THE STOCK SYMBOL
    if (body.quandl_error) {
      res.send('This stock symbol does not exist in the Quandl Database.');
    // IF SYMBOL EXISTS IN QUANDL, THEN SAVE TO MONGODB
    } else {
      var newStock = new Stock({
        name: body.dataset.dataset_code,
        dates: dates,
        prices: prices
      });
      Stock.saveStock(newStock, function(err, doc) {
        if (err) throw err;
      });
      // AFTER SAVING TO DB, FIND ALL SAVED STOCKS
      // AND CREATE A NEW OBJECT FOR CHARTS.JS
      Stock.findStocks(function(err, docs) {
        if (err) throw err;
        chartData.labels = docs[0].dates;
        docs.forEach(function(item) {
          chartData.datasets.push(
            {
              label: item.name,
              fillColor: 'rgba(151,187,205,0.5)',
              strokeColor: 'rgba(151,187,205,1)',
              pointColor: 'rgba(151,187,205,1)',
              pointStrokeColor: '#fff',
              data: item.prices
            }
          );
        });
        // SEND CHARTSJS DATA WITH THE RESPONSE
        res.send(chartData);
      });
    }
  });
});

// ANGULAR CORE.JS USES THIS API ENDPOINT TO LOAD CHARTS AUTOMATICALLY
router.get('/init/chart', function(req, res, next) {
  var chartData = {};
  chartData.datasets = [];
  Stock.findStocks(function(err, docs) {
    if (err) throw err;
    if (docs === {}) {
      res.send('There is no data');
    } else {
      chartData.labels = docs[0].dates;
      docs.forEach(function(item) {
        chartData.datasets.push(
          {
            label: item.name,
            fillColor: 'rgba(151,187,205,0.5)',
            strokeColor: 'rgba(151,187,205,1)',
            pointColor: 'rgba(151,187,205,1)',
            pointStrokeColor: '#fff',
            data: item.prices
          }
        );
      });
    }  
    res.send(chartData);
  });
});

module.exports = router;
