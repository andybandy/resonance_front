(function() {
  var steps = 50;
  var interpolate = function(p1, p2, time) {
    return parseInt((time - p1.time)*(p2.rate - p1.rate)/(p2.time - p1.time) + p1.rate);
  };

  var app = angular.module('app', ['firebase']);

  app.controller('DevicesController', ['$scope', '$firebase', function($scope, $firebase) {
    var ref = new Firebase('https://sweltering-torch-1638.firebaseio.com/');
    var sync = $firebase(ref);
    var self = this;

    this.ds = {};
    this.data = sync.$asObject();
    ref.on('value', function(snap) {
      _.each(snap.val()._devices, function(d, ind) {
        if (d.signals) {
          var unsortedSignals = _.map(d.signals, function(rate, time) {
            return {time: parseInt(time), rate: rate};
          });
          self.ds[ind] = [];
          var signals = _.sortBy(unsortedSignals, function(n) {
            return n.time;
          });
          signals = signals.slice(Math.max(signals.length - steps, 1));
          var min = signals[0].time;
          var max = signals[signals.length - 1].time;
          var step = (max - min)/steps;
          var c = 0;
          for (var i = 0; i < steps; i++) {
            while (signals[0].time + i*step > signals[c + 1].time) {
              c++;
            }
            var value = interpolate(signals[c], signals[c + 1], i*step + signals[0].time);
            self.ds[ind].push({time: i, rate: value});
          }
          console.log(JSON.stringify(self.ds[ind]));
          console.log(signals.length);
        }
      });
    });

    setInterval(function() {
      var _counter = 0;
      _.each(self.ds, function(d, ind) {
        var canvas = $('#canvas' + _counter);
        _counter++;
        if (canvas.length > 0) {
          var context = canvas[0].getContext('2d');
          context.clearRect(0, 0, 450, 200);
          context.beginPath();
          context.lineWidth = 5;
          context.strokeStyle = 'blue';
          context.moveTo(0, 200 - d[0].rate);
          _.each(d, function(point) {
            context.lineTo(point.time*9, 200 - point.rate);
          });
          context.stroke();
          context.closePath();
        }
      });
    }, 1000);
  }]);

  app.directive('devices', function($templateCache) {
    return {
      restrict: 'E',
      templateUrl: 'devices.html'
    };
  });
})();
