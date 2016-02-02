var app = angular.module('app', ['chartjs-directive']);

// Integrates socket.io with AngularJS
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

  $scope.updateData = function() {
    var chart = document.getElementById("myCoolChart").getAttribute("type");
    $scope.generateData();
  };

  $scope.generateData = function(){
    var sevenRandNumbers = function(){
      var numberArray = [];
      for (var i=0;i<7;i++){
        numberArray.push(Math.floor((Math.random()*100)+1));
      }
      return numberArray;
    };
    var data = {
      labels : ["January","February","March","April","May","June","July"],
      datasets : [
        {
          fillColor : "rgba(220,220,220,0.5)",
          strokeColor : "rgba(220,220,220,1)",
          pointColor : "rgba(220,220,220,1)",
          pointStrokeColor : "#fff",
          data : sevenRandNumbers()
        },
        {
          fillColor : "rgba(151,187,205,0.5)",
          strokeColor : "rgba(151,187,205,1)",
          pointColor : "rgba(151,187,205,1)",
          pointStrokeColor : "#fff",
          data : sevenRandNumbers()
        }
      ]
    };
    $scope.myChart = {"data": data, "options": {} };
  };

  $scope.updateData();

  socket.on('show stocks', function(data) {
    $scope.fetched = data.data;
  });

  $scope.searchStocks = function(stock) {
    $http.get('/api/' + stock)
      .success(function(data) {
        $scope.fetched = data.data;
        socket.emit('updated quotes');
      })
      .error(function(err) {
        console.log('There was an error because of: ' + err);
      });
  };

}
