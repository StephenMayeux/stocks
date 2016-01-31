var mongoose = require('mongoose');

var stockSchema = mongoose.Schema({
  name: String
});

var Stock = module.exports = mongoose.model('Stock', stockSchema);

module.exports.saveStock = function(newStock, callback) {
  newStock.save(callback);
};
