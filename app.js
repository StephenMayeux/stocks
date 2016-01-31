var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
app.io = require('socket.io')();
var routes = require('./routes/index');
var api = require('./routes/api');
var mongoose = require('mongoose');
var Stock = require('./models/stock');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/stocks');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.io.on('connection', function(socket){

  console.log('a user connected');

  Stock.findStocks(function(err, docs) {
    if (err) throw err;
    app.io.sockets.emit('show stocks', {data: docs});
  });

  socket.on('updated quotes', function(data) {
    Stock.findStocks(function(err, docs) {
      if (err) throw err;
      app.io.sockets.emit('show stocks', {data: docs});
    });
  });

  socket.on('disconnect', function(data) {
    console.log('a user has disconnected');
  });

});

module.exports = app;
