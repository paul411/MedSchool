app.directive('compareStat', function() {
  return {
    restrict: 'EA',
    scope: {me: '@', to: '@', min: '@', max: '@', display: '@', full: '@'
    },
    templateUrl: 'views/compareStat.html'
  }
});

app.directive('showStat', function() {
  return {
    restrict: 'E',
    scope: {stat: '@', min: '@', max: '@', display: '@', full: '@'
    },
    templateUrl: 'views/showStat.html'
  }
});