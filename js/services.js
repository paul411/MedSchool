//var dataSrc = 'https://s3.amazonaws.com/codecademy-content/courses/ltp4/emails-api/emails.json';
var dataSrc = 'https://spreadsheets.google.com/feeds/list/0AmKVGWwobG5GdEx2MjlBTDE0bXFXNGFZczZqYTZKb2c/od6/public/values?alt=json';

app.factory('emails', ['$http', function($http) {
    return $http.get(dataSrc).success(function(data) {
        return data;
    }).error(function(data) {
        return data;
    });
}]);