
var homeControllers = angular.module('homeControllers', ['ngResource', 'homeServices']);

homeControllers.controller('SearchController', ['$scope', '$log', '$resource', '$timeout', '$location', 'loadingService',
    function ($scope, $log, $resource, $timeout, $location, loadingService) {

        var fuzzySearch = $resource('/fs/:title');
        var enterSearch = $resource('/s/:title');
        var searchContainer = [];

        $scope.searchContainer = [];
        $scope.selectedTitle = null;
        $scope.movieTitle = '';


        $scope.loadingService = loadingService;

        $scope.$watch('includeTV', function () {
//            $log.info('TV: ' + $scope.includeTV);
        });

        $scope.$watch(function () {
            return searchContainer;
        }, function () {
            $scope.updateTitleList();
        });

        $scope.$on('$locationChangeSuccess', function (event, newLocation, oldLocation) {
            if ($location.path().length > 0) {
                hashChanged();
            }
        });

        $timeout(function () {
            $scope.includeTV = true;
            $('body').addClass('loaded');

            if (mobileVersion == false) {
                TweenMax.from($('#home-search'), 2.5, {ease: Bounce.easeOut, top: -600});
                TweenMax.from($('#rexinfo'), 1, {opacity: 0, delay: 2.5});
            } else {
                TweenMax.from($('#home-search h1'), 2.5, {ease: Bounce.easeOut, top: -600});
                TweenMax.from($('#mobileSearch'), 1, {top: -200, delay: 1.5});
                TweenMax.from($('#rexinfo h2'), 1, {delay: 1.5, opacity: 0});
                TweenMax.from($('#rexinfo p'), 1, {delay: 1.5, opacity: 0, y: '+=6'});
            }
        });

        $scope.titleChange = function () {
            if ($scope.movieTitle.length === 0) {
                $scope.clearSearchContainer();
                return;
            }
            var searchFor = $scope.movieTitle.replace(/ /g, '_').toLowerCase();
            $scope.selectedTitle = null;
            fuzzySearch.get({title: searchFor}, function (data) {
                searchContainer = data.d;
                angular.forEach(searchContainer, function (title, key) {
                    title.img = title.i === undefined ? '/img/no-poster.png' : (function () {
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
                searchContainer = searchContainer && searchContainer.filter(function (title) {
                    return title.movie || title.tv;
                });
            });
        };

        $scope.titleEnter = function () {
            var searchFor = $scope.movieTitle.replace(/ /g, '_').toLowerCase();
            $scope.selectedTitle = null;
            enterSearch.query({title: searchFor}, function (data) {
                searchContainer = data;
                angular.forEach(searchContainer, function (title, key) {
                    title.img = title.image === undefined ? '/img/no-poster.png' : (function () {
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

        $scope.updateTitleList = function () {
            if (searchContainer === undefined) {
                return;
            }
            $scope.searchContainer = searchContainer.filter(function (title) {
                return title.movie || (title.tv && $scope.includeTV);
            });
        };

        $scope.titleBoxKeyDown = function (e) {
            if ($scope.searchContainer.length > 0) {
                switch (e.which) {
                    case 40:
                        if ($scope.selectedTitle === null) {
                            $scope.selectedTitle = 0;
                        }
                        else {
                            if ($scope.searchContainer.length - 1 > $scope.selectedTitle) {
                                $scope.selectedTitle++;
                            }
                        }
                        break;
                    case 38:
                        if ($scope.selectedTitle === null) {
                            $scope.selectedTitle = $scope.searchContainer.length - 1;
                        }
                        else {
                            if ($scope.selectedTitle > 0) {
                                $scope.selectedTitle--;
                            }
                        }
                        break;
                }
                $scope.scFocus();
            }

        };

        $scope.clearSearchContainer = function () {
            searchContainer = [];
            $scope.selectedTitle = null;
        };

        $scope.scFocus = function () {
            $timeout(function () {
                angular.element('li.selected').focus();
                angular.element('.title-box').focus();
            });
        };

        $scope.movieRex = function (id, title) {
            $location.path("rex/" + id + "/" + title.replace(/\s+/g, '_').toLowerCase());
//            window.location.hash = "#!rex/" + id + "/" + title.replace(/\s+/g, '_').toLowerCase();
            ga('send', 'event', 'Movies', 'search', title);
            ga('set', 'page', window.location.hash);
            ga('send', 'pageview');
            $scope.clearSearchContainer();
        };

    }]);


