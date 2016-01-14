
var movieRexApp = angular.module('movieRexApp', [
//  'ngRoute',
  'homeControllers'
]);

movieRexApp.config(['$locationProvider', function( $locationProvider ){
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');        
}]);
