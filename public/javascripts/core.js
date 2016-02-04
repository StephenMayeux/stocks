// Declare app and inject ChartsJS
var app = angular.module('app', ['chartjs-directive']);

// Encapsulate Socket.io in Angular's Dependency Injection System
app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});

//Main Controller for our app
function MainController($scope, $http, socket) {

  // Create empty object to store ChartsJS data
  $scope.chartData = {};

  // When the page intially loads, get charts data
  $http.get('/api/init/chart')
    .success(function(data) {
      $scope.chartData = data;
      socket.emit('updated quotes');
      socket.emit('updated charts', {data: $scope.chartData});
      $scope.createChart($scope.chartData);
    })
    .error(function(err) {
      console.log('There was an error because of: ' + err);
    });

  // show charts to all connected users
  socket.on('show charts', function(data) {
    $scope.createChart(data.data);
  });

  // takes chartsjs data and creates the chart
  $scope.createChart = function(data){
    $scope.myChart = {"data": data, "options": {reponsive: true, scaleShowLabels: false, showTooltips: false, pointDot: false} };
  };

  // Show stock symbols to all connected users
  socket.on('show stocks', function(data) {
    $scope.fetched = data.data;
  });

  // click event for adding new stock symbol
  $scope.searchStocks = function(stock) {
    $http.get('/api/' + stock)
      .success(function(data) {
        $scope.chartData = data;
        socket.emit('updated quotes');
        socket.emit('updated charts', {data: $scope.chartData});
        $scope.createChart($scope.chartData);
      })
      .error(function(err) {
        console.log('There was an error because of: ' + err);
      });
  };

}
