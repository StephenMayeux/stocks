var mongoose = require('mongoose');

var stockSchema = mongoose.Schema({
  name: String,
  dates: Array,
  prices: Array
});

var Stock = module.exports = mongoose.model('Stock', stockSchema);

module.exports.saveStock = function(newStock, callback) {
  newStock.save(callback);
};

module.exports.findStocks = function(query, projection, callback) {
  Stock.find(query, projection, callback);
};
