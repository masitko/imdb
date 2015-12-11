
var homeControllers = angular.module( 'homeControllers', ['ngResource'] );



homeControllers.controller('SearchController', ['$scope', '$resource',
  function ($scope, $resource) {
      
      var fuzzySearch = $resource('/fs/:title');
      
      console.log(fuzzySearch);
      
      $scope.titleChange = function() {
          console.log(this.movieTitle);
          fuzzySearch.get({title:$scope.movieTitle}, function( data ) {
              $scope.fuzzySearch = data.d;
              angular.forEach( $scope.fuzzySearch, function(value, key) {
                  console.log(value);
              });
          });
      };
      
      
  }]);