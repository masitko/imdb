
var homeControllers = angular.module('homeControllers', ['ngResource', 'homeServices']);


homeControllers.controller('SearchController', ['$scope', '$log', '$resource', '$timeout', 'loadingService',
    function ($scope, $log, $resource, $timeout, loadingService) {

        var fuzzySearch = $resource('/fs/:title');
        var enterSearch = $resource('/s/:title');

        var searchContainer = [];
        
        $scope.loadingService = loadingService;

        $scope.$watch('includeTV', function () {
            $log.info('TV: '+$scope.includeTV);
        });

        $timeout(function() {
            $scope.includeTV = true;
        });
        
        $scope.mainInit = function() {
            $scope.includeTV = 'true';
        };

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
//            $log.info($scope.movieTitle);
            var searchFor = $scope.movieTitle.replace(/ /g, '_').toLowerCase();
            enterSearch.query({title: searchFor}, function (data) {
                $scope.searchContainer = data;
                angular.forEach($scope.searchContainer, function (title, key) {
//                    $log.info(title);  
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
            $scope.movieRex(title.id, title.title);
        };

        $scope.titleBoxKeyUp = function (e) {
//            $log.info(e);
            switch (e.which) {
                case 13: // if Enter 
                    if ($('li.selected').length > 0) {
//                        $log.info('CLICK');
//                                          $('li.selected .title-container').click();
                        $scope.movieRex( liSelected.find('.title-container').data('id'), liSelected.find('.title-container').data('title') );
                    }
                    else if ($scope.movieTitle.length > 0) {
//                        $log.info('ENTER');
                        $scope.titleEnter();
//                        getSearchData(this.value.replace(/ /g, '_').toLowerCase());
                    }
                    break

            }
        };

        $scope.movieRex = function( id, title ) {
            window.location.hash = "#!rex/" + id + "/" + title.replace(/\s+/g, '_').toLowerCase();
            ga('send', 'event', 'Movies', 'search', title);
            ga('set', 'page', window.location.hash);
            ga('send', 'pageview');            
            $scope.searchContainer = [];
        };

    }]);