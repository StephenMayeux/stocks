var mongoose = require('mongoose');

var stockSchema = mongoose.Schema({
  label: String,
  fillColor: String,
  strokeColor: String,
  pointColor: String,
  pointStrokeColor: String,
  pointHighlightFill: String,
  pointHighlightStroke: String,
  dates: Array,
  data: Array
});

var Stock = module.exports = mongoose.model('Stock', stockSchema);

module.exports.saveStock = function(newStock, callback) {
  newStock.save(callback);
};

module.exports.findStocks = function(query, projection, callback) {
  Stock.find(query, projection, callback);
};
