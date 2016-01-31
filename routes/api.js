var express = require('express');
var router = express.Router();
var Quandl = require('quandl');

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
    console.log('This is the response variable: ' + typeof response);
    var body = JSON.parse(response);
    console.log('This is the body variable: ' + typeof body);
    res.send(body.dataset.data);
  });

});

module.exports = router;
