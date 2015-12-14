
var homeControllers = angular.module('homeControllers', ['ngResource']);



homeControllers.controller('SearchController', ['$scope', '$resource',
    function ($scope, $resource) {

        var fuzzySearch = $resource('/fs/:title');
        var enterSearch = $resource('/s/:title');

        $scope.$watch('includeTV', function () {
            console.log($scope.includeTV);
        });
        
        $scope.titleChange = function () {
//            console.log(this.movieTitle);

            fuzzySearch.get({title: $scope.movieTitle}, function (data) {
                $scope.fuzzySearch = data.d;
                angular.forEach($scope.fuzzySearch, function (title, key) {
                    title.image = title.i === undefined ? '/img/no-poster.png' : (function () {
                        var ia = title.i[0].split('.');
                        var type = ia.pop();
                        ia.pop();
                        ia.push('_V1', '_UX40_CR0,0,40,54_', type);
                        return ia.join('.');
                    })();
                    title.movie = title.q && title.q.match(/(movie|feature)/);
                    title.tv = title.q && title.q.match(/TV series/);
                });
            });
        };
        
        $scope.titleClick = function(title) {
            movieRex(title.id, title.l);
        };
            
      
        


    }]);