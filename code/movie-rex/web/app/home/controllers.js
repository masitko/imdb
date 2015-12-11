
var homeControllers = angular.module( 'homeControllers', [] );



homeControllers.controller('SearchController', ['$scope',
  function ($scope) {
      
      $scope.titleChange = function() {
          console.log(this.movieTitle);          
      };
      
  }]);