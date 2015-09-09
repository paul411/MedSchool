var app = angular.module('OutboxApp', ['ngRoute','xeditable','angular.filter','chart.js','ui.bootstrap']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        controller: "HomeController",
        templateUrl: "views/home.html"
    }).when('/school/:id', {
        controller: 'SchoolController',
        templateUrl: 'views/school.html'
    }).otherwise({
        redirectTo: '/home'
    });
}]);

app.controller('MyStatsCtrl', function($scope,$rootScope,testFactory) {
    $scope.mySt = testFactory.getStats; //mySt = my stats
    $scope.user = $scope.mySt();
    $scope.myMet = testFactory.getMetric; //myMet = my "metric"    
    
	// function to submit the form after all validation has occurred			
	$scope.submitForm = function(isValid) {
		console.log(isValid);
	};
});

app.config(function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      colours: ['#97BBCD', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360', '#DCDCDC'],
      responsive: true,
      legend: true
      
    });
    // Configure all doughnut charts
    ChartJsProvider.setOptions('Doughnut', {
      animateScale: true
    });
});

app.controller('PieCtrl', function ($scope) {});

app.controller('SchoolController', ['$scope', '$log','$routeParams','testFactory',function($scope,$log, $routeParams,testFactory) {
    $scope.schools = masterData.feed.entry;
    $scope.myStats = testFactory.getStats();
    $scope.myMet = testFactory.getMetric;
    $scope.user = testFactory.getStats();
    $scope.myMcat =  testFactory.getMcat; 
    
    $scope.school = angular.fromJson(masterData).feed.entry[$routeParams.id];
    if(!angular.isUndefined($scope.school.gsx$_cyevm)){$scope.cgpa = $scope.school.gsx$_cyevm.$t;}
    if(!angular.isUndefined($scope.school.gsx$gpa)){$scope.sgpa = $scope.school.gsx$gpa.$t;}
    if(!angular.isUndefined($scope.school.gsx$_ckd7g)){$scope.mcat = $scope.school.gsx$_ckd7g.$t;}
    if(!angular.isUndefined($scope.school.gsx$mcat)){$scope.mcatPS = $scope.school.gsx$mcat.$t;}
    if(!angular.isUndefined($scope.school.gsx$_chk2m)){$scope.mcatBS = $scope.school.gsx$_chk2m.$t;}
    if(!angular.isUndefined($scope.school.gsx$_ciyn3)){$scope.mcatVR = $scope.school.gsx$_ciyn3.$t;}
    
    //console.log('school sGPA ' + $scope.sgpa + ' school cGPA ' + $scope.cgpa + ' MCAT ' + $scope.mcat)
    if($scope.sgpa > 0 && $scope.sgpa > 0 && $scope.mcat > 0) {
        $scope.schoolMetric = ((($scope.sgpa*0.65+$scope.cgpa*0.35)/4)*0.5+($scope.mcat)/45*0.5)*800;
    }
    else if ($scope.cgpa > 0 && $scope.mcat > 0) {
        $scope.schoolMetric = (($scope.cgpa/4)*0.5+($scope.mcat)/45*0.5)*800;
    }
    else {
        $scope.schoolMetric = -1;
    }
    $scope.schoolMetric = Math.round($scope.schoolMetric);
    
    
    $scope.schoolMetric = Math.round($scope.school.gsx$academindex.$t);
    console.log('data:' + Math.round($scope.school.gsx$academindex.$t) + '. schoolmetric: ' + $scope.schoolMetric);
    
    var myIndex = $routeParams.id * 1;
    var numSchools = angular.fromJson(masterData).feed.entry.length-1; //Array length is one higher than the actual # of schools for some reason...
    var nextIndex; 
    var prevIndex;
    
    if(myIndex == 1) {
        nextIndex = 1 + myIndex;
        prevIndex = numSchools;
    }
    else if(myIndex == numSchools){
        nextIndex = 1;
        prevIndex = myIndex - 1;
    }
    else {
        nextIndex = myIndex + 1;
        prevIndex = myIndex - 1;
    }
    
    $scope.prevSchoolIndex = prevIndex;
    $scope.prevSchool = angular.fromJson(masterData).feed.entry[prevIndex];
    $scope.nextSchoolIndex = nextIndex;
    $scope.nextSchool = angular.fromJson(masterData).feed.entry[nextIndex];  
    
    if(!angular.isUndefined($scope.school.gsx$_d180g)){
    $scope.applicants = Math.round($scope.school.gsx$_d180g.$t);
    $scope.inStateApplicants = Math.round($scope.school.gsx$applicants.$t);
    $scope.outOfStateApplicants = $scope.applicants - $scope.inStateApplicants;}

    
    if(!angular.isUndefined($scope.school.gsx$_cu76f)){
    $scope.interviews = Math.round($scope.school.gsx$_cu76f.$t);
    $scope.inStateInterviews = Math.round($scope.school.gsx$interviews.$t);
    $scope.outOfStateInterviews = $scope.interviews - $scope.inStateInterviews;}
    
    if(!angular.isUndefined($scope.school.gsx$_d9ney)){
    $scope.matriculants = Math.round($scope.school.gsx$_d9ney.$t);
    $scope.inStateMatriculants = Math.round($scope.school.gsx$matriculants.$t);
    $scope.outOfStateMatriculants = $scope.matriculants - $scope.inStateMatriculants;}
        
}]);


app.controller('HomeController', ['$scope','testFactory', function($scope,testFactory) {
    $scope.schools = masterData.feed.entry;
    $scope.myStats = testFactory.getStats();
    $scope.myMet = testFactory.getMetric;
    $scope.myMcat =  testFactory.getMcat;
}]);

// This filter makes the assumption that the input will be in decimal form (i.e. 17% is 0.17).
app.filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
      var plusSign = '';
      //if(input>0) {plusSign = '+';}
    return plusSign + $filter('number')(input * 100, decimals) + '%';
  };
}]);

app.controller('StackedBarCtrl',['$scope', '$log', function ($scope, $log) {
   $scope.stackedBarlabels = [];
   $scope.stackedBardata = [];
   if($scope.applicants>0){
     $scope.stackedBarlabels.push('Overall');
     $scope.stackedBardata.push([]);
     $scope.stackedBardata[0].push($scope.interviews);
   }
   if($scope.interviews>0)
   {
     $scope.stackedBardata.push([]);
     $scope.stackedBardata[1].push($scope.applicants);
   }
   
    //$scope.stackedBarlabels = ['Overall','In State', 'Out of State'];
    $scope.stackedBartype = 'StackedBar';
    //$scope.stackedBardata = [      [65, 59, 90],      [28, 48, 40],      [28, 48, 40]    ];
    alert($scope.stackedBarlabels + $scope.stackedBardata);
  }]);
  
  
 app.factory('testFactory', function(){
    var countF = {
        "cgpa":3.5,
        "sgpa":3.5,
        "mcatps":10,
        "mcatbs":11,
        "mcatvr":9,
    };

    return {
        getStats : function () {
            return countF;
        },
        getMcat : function() {
            return (countF.mcatps * 1 + countF.mcatvr * 1 + countF.mcatbs * 1); 
        },
        getMetric : function() {
            return ((((countF.sgpa*0.65+countF.cgpa*0.35)/4)*0.5+((countF.mcatps*1+countF.mcatbs*1+countF.mcatvr*1)/45)*0.5)*800);
        }
    }               
});
