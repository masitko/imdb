

homeControllers.directive('fsInput', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                element.bind('input', function () {
                    scope.titleChange();
                });

                element.bind('keyup', function (e) {
                    switch (e.which) {
                        case 13: // if Enter 
                            if (scope.selectedTitle !== null) {
                                $('body').removeClass('typing');
                                scope.movieRex(scope.searchContainer[scope.selectedTitle].id, scope.searchContainer[scope.selectedTitle].title);
                            }
                            else if (scope.movieTitle.length > 0) {
                                scope.titleEnter();
                            }
                            break
                        case 27: // if ESC
                            scope.movieTitle = '';
                            scope.clearSearchContainer();
                            break
                    }

                    $timeout(function () {
                        if (scope.movieTitle.length > 1) {
                            if (scope.searchContainer.length > 0) {
                                $('#home-search').attr('class', 'choose');
                            } else {
                                $('#home-search').attr('class', 'spell');
                            }
                        } else {
                            $('#home-search').attr('class', '');
                        }
                    }, 900);
                });

                element.bind('keydown', function (e) {
                });

                element.bind('focus', function () {
                    element.placeholder = '';
                    $('body').addClass('typing');
                });

                element.bind('blur', function () {
                    element.placeholder = 'Tell me a movie you like';
                    $('body').removeClass('typing');
                });

                element.bind('click', function () {
                    element.select();
                });

            }
        };
    }]);


homeControllers.directive('suggList', ['$timeout', function ($timeout) {
        var timeoutHover = null;
        return {
            restrict: 'EA',
            templateUrl: 'templates/sugg-list.html',
            scope: {
                suggestions: '=',
//                selectedTitle: '=',
                movieRex: '&'
            },
            controller: function ($scope, $element) {
                
            },
            link: function (scope, element, attrs) {
                
                var movieRexHandler = scope.movieRex();
                scope.titleClicked = function (title) {
                    movieRexHandler(title.id, title.title);
                };
  
                scope.sugMouseover= function() {
                    $timeout.cancel(timeoutHover);
                    angular.element('#slider-container').addClass('hover');
                };
                scope.sugMouseleave= function() {
                    timeoutHover = $timeout(function () {
                        angular.element('#slider-container').removeClass('hover');
                    }, 250);
                };
            }
        };
}]);


homeControllers.directive('fsList', ['$interval', function ($interval) {
        return {
            restrict: 'E',
            templateUrl: 'templates/fs-list.html',
            scope: {
                searchContainer: '=',
                selectedTitle: '=',
                movieRex: '&'
            },
            controller: function ($scope, $element) {
            },
            link: function (scope, element, attrs) {           
                var movieRexHandler = scope.movieRex();
                scope.titleClicked = function (title) {
                    movieRexHandler(title.id, title.title);
                };

//            timeoutId = $interval(function() {
//                console.log(scope.searchContainer);
//            }, 1000);            
            }
        };
    }]);


homeControllers.directive('fsTitle', function () {
    return {
        restrict: 'A',
        templateUrl: 'templates/fs-title.html',
//        scope: {
//            title: '=',
//            movieRex: '&'
//        },
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                scope.movieRex(scope.title.id, scope.title.title);
            });
            element.bind('click', function () {
                scope.movieRex(scope.title.id, scope.title.title);
            });
            element.bind('click', function () {
                scope.movieRex(scope.title.id, scope.title.title);
            });
        }
    };
});

