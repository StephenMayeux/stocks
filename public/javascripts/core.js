var app = angular.module('app', []);

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

function MainController($scope, $http, socket) {

  $scope.searchStocks = function(stock) {
    $http.get('/api/' + stock)
      .success(function(data) {
        console.log(data);
        $scope.stocks = data;
      })
      .error(function(err) {
        console.log('Shit fucked up because of: ' + err);
      });
  };

}
