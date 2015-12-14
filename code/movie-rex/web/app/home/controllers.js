
var homeControllers = angular.module('homeControllers', ['ngResource']);



homeControllers.controller('SearchController', ['$scope', '$resource',
    function ($scope, $resource) {

        var fuzzySearch = $resource('/fs/:title');
        var enterSearch = $resource('/s/:title');

        var searchContainer = [];

        $scope.$watch('includeTV', function () {
            console.log($scope.includeTV);
        });

        $scope.titleChange = function () {
            var searchFor = $scope.movieTitle.replace(/ /g, '_').toLowerCase();
            fuzzySearch.get({title: searchFor}, function (data) {
                $scope.searchContainer = data.d;
                angular.forEach($scope.searchContainer, function (title, key) {
                    title.img = title.i === undefined ? '/img/no-poster.png' : (function () {
                        var ia = title.i[0].split('.');
                        var type = ia.pop();
                        ia.pop();
                        ia.push('_V1', '_UX40_CR0,0,40,54_', type);
                        return ia.join('.');
                    })();
                    title.movie = title.q && title.q.match(/(movie|feature)/);
                    title.tv = title.q && title.q.match(/TV series/);
                    title.title = title.l;
                    title.additional = '('+title.y+')';
                });
            });
        };

        $scope.titleEnter = function () {
            var searchFor = $scope.movieTitle.replace(/ /g, '_').toLowerCase();
            enterSearch.query({title: searchFor}, function (data) {
                console.log(data);
                $scope.searchContainer = data;
                angular.forEach($scope.searchContainer, function (title, key) {
                    console.log(title);  
                    title.img = title.image === undefined ? '/img/no-poster.png' : (function () {
                        var ia = title.image.split('.');
                        var type = ia.pop();
                        ia.pop();
                        ia.push('_UX40_CR0,0,40,54_', type);
                        return ia.join('.');
                    })();
                    title.movie = true;
                    title.tv = title.q && title.q.match(/TV/);
                });
            });
        };

        $scope.titleClick = function (title) {
            movieRex(title.id, title.l);
        };

        $scope.titleBoxKeyUp = function (e) {
            switch (e.which) {
                case 13: // if Enter 
                    if ($('li.selected').length > 0) {
                        $('li.selected .title-container').click();
                    }
                    else if ($scope.movieTitle.length > 0) {
                        $scope.titleEnter();
//                        getSearchData(this.value.replace(/ /g, '_').toLowerCase());
                    }
                    break

            }
        };



    }]);