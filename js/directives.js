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

app.directive('showRank', function() {
  return {
    restrict: 'E',
    scope: {rank: '@', max: '@', display: '@', full: '@'
    },
    link: function(scope, elem, attrs) {
      scope.percentile = Math.floor(attrs.rank/attrs.max*100/25);
    },
    templateUrl: 'views/showRank.html',
  }
});

app.directive('compareStatLabel', function() {
  return {
    restrict: 'E',
    scope: {me: '@', to: '@', min: '@', max: '@', display: '@', full: '@'
    },
    templateUrl: 'views/compareStatLabel.html',
  }
});