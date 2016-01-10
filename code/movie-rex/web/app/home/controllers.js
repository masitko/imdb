
var homeControllers = angular.module('homeControllers', ['ngResource', 'homeServices']);

homeControllers.controller('SearchController', ['$scope', '$log', '$resource', '$timeout', 'loadingService',
    function($scope, $log, $resource, $timeout, loadingService) {

        var fuzzySearch = $resource('/fs/:title');
        var enterSearch = $resource('/s/:title');
        var searchContainer = [];

        $scope.searchContainer = [];
        
        $scope.loadingService = loadingService;

        $scope.$watch('includeTV', function() {
//            $log.info('TV: ' + $scope.includeTV);
        });

        $timeout(function() {
            $scope.includeTV = true;
        });

        $scope.titleChange = function() {
            if( $scope.movieTitle.length === 0 ) {
                searchContainer = [];
                $scope.searchContainer = [];
                return;
            }
            var searchFor = $scope.movieTitle.replace(/ /g, '_').toLowerCase();
            $scope.selectedTitle = null;
            fuzzySearch.get({title: searchFor}, function(data) {
                searchContainer = data.d;
                angular.forEach(searchContainer, function(title, key) {
                    title.img = title.i === undefined ? '/img/no-poster.png' : (function() {
                        var ia = title.i[0].split('.');
                        var type = ia.pop();
                        ia.pop();
                        ia.push('_V1', '_UX40_CR0,0,40,54_', type);
                        return ia.join('.');
                    })();
                    title.movie = (title.q !== undefined) && (title.q.search(/(movie|feature)/) !== -1);
                    title.tv = (title.q !== undefined) && (title.q.search(/TV series/) !== -1);
                    title.title = title.l;
                    title.additional = '(' + title.y + ')';
                });
                // remove all non-tv or non-movie items
                searchContainer = searchContainer && searchContainer.filter(function(title) {
                    return title.movie || title.tv;
                });
                $scope.updateTitleList();
            });
        };

        $scope.titleEnter = function() {
            var searchFor = $scope.movieTitle.replace(/ /g, '_').toLowerCase();
            $scope.selectedTitle = null;
            enterSearch.query({title: searchFor}, function(data) {
                searchContainer = data;
                angular.forEach(searchContainer, function(title, key) {
                    title.img = title.image === undefined ? '/img/no-poster.png' : (function() {
                        var ia = title.image.split('.');
                        var type = ia.pop();
                        ia.pop();
                        ia.push('_UX40_CR0,0,40,54_', type);
                        return ia.join('.');
                    })();
                    title.movie = true;
                    title.tv = (title.q !== undefined) && (title.q.search(/TV/) !== -1);
                });
                $scope.updateTitleList();
            });
        };

        $scope.updateTitleList = function() {
            if( searchContainer === undefined ) {
                return;
            }
            $scope.searchContainer = searchContainer.filter(function(title) {
                return title.movie || (title.tv && $scope.includeTV);
            });            
        };

//        $scope.titleClick = function(title) {
//            $scope.movieRex(title.id, title.title);
//        };

        $scope.titleBoxKeyUp = function(e) {
            switch (e.which) {
                case 13: // if Enter 
                    if( $scope.selectedTitle !== null) {
                        $scope.movieRex($scope.searchContainer[$scope.selectedTitle].id, $scope.searchContainer[$scope.selectedTitle].title);
                    }
                    else if ($scope.movieTitle.length > 0) {
                        $scope.titleEnter();
                    }
                    break
                case 27: // if ESC
                    $scope.movieTitle = '';
                    searchContainer = [];
                    $scope.searchContainer = [];
                    break

            }
        };

        $scope.titleBoxKeyDown = function(e) {
            if ($scope.searchContainer.length > 0) {
                switch (e.which) {
                    case 40:
                        if( $scope.selectedTitle === null) {
                            $scope.selectedTitle = 0;
                        }
                        else {
                            if( $scope.searchContainer.length-1 > $scope.selectedTitle ) {
                                $scope.selectedTitle++;
                            }
                        }
                        break;
                    case 38:
                        if( $scope.selectedTitle === null) {
                            $scope.selectedTitle = $scope.searchContainer.length-1;
                        }
                        else {
                            if( $scope.selectedTitle > 0 ) {
                                $scope.selectedTitle--;
                            }
                        }
                        break;
                }
                $timeout(function(){
                    angular.element('li.selected').focus();
                    angular.element('.title-box').focus();
                });
            }

        };


        $scope.movieRex = function(id, title) {
//            console.log('REX1!!!, '+window.location.hash);
            window.location.hash = "#!rex/" + id + "/" + title.replace(/\s+/g, '_').toLowerCase();
//            console.log('REX2!!!, '+window.location.hash);
            ga('send', 'event', 'Movies', 'search', title);
            ga('set', 'page', window.location.hash);
            ga('send', 'pageview');
            $scope.searchContainer = [];
        };

    }]);


