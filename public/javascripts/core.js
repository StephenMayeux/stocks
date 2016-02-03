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

  socket.on('show charts', function(data) {
    $scope.createChart(data.data);
  });

  $scope.createChart = function(data){
    console.log($scope.chartData);
    $scope.myChart = {"data": data, "options": {reponsive: true, scaleShowLabels: false, showTooltips: false, pointDot: false} };
  };

  socket.on('show stocks', function(data) {
    $scope.fetched = data.data;
  });

  $scope.searchStocks = function(stock) {
    $http.get('/api/' + stock)
      .success(function(data) {
        //$scope.fetched = data.data;
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
