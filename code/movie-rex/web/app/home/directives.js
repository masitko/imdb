

homeControllers.directive( 'll', ['$timeout', function( $timeout ) {
        
}]);

homeControllers.directive( 'fsInput', ['$timeout', function( $timeout ) {
    return {
        restrict: 'A',
        link: function( scope, element, attrs ) {
            element.bind('input', function() {
                scope.titleChange();
            });
            element.bind('keyup', function() {
                $timeout(function () {
                    if ($('.title-box').val().length > 1) {
                        if ($('.search-list li').length > 0) {
                            $('#home-search').attr('class', 'choose');
                        } else if (($('.search-list li').length === 0)) {
                            $('#home-search').attr('class', 'spell');
                        }
                    } else {
                        $('#home-search').attr('class', '');
                    }
                }, 900);
            });
            element.bind('focus', function() {
                element.placeholder = '';
                $('body').addClass('typing');
            });
            element.bind('blur', function() {
                element.placeholder = 'Tell me a movie you like';
                $('body').removeClass('typing');
            });
            element.bind('click', function() {
                element.select();                
            });
            
        }
    };
}]);

homeControllers.directive( 'fsTitle', function(){
    return {
        restrict: 'A',
        templateUrl: 'templates/fs-title.html',
//        scope: {
//            title: '=',
//            movieRex: '&'
//        },
        link: function( scope, element, attrs ) {
            element.bind('click', function() {
                scope.movieRex(scope.title.id, scope.title.title);
            });
        }
    };
});


homeControllers.directive( 'fsList', ['$interval', function($interval){
    return {
        restrict: 'EA',
        templateUrl: 'templates/fs-list.html',
        scope: {
            searchContainer: '=',
            selectedTitle: '=',
            movieRex: '&'
        },
        controller: function( $scope, $element ) {
        },
        link: function( scope, element, attrs ) {
            var movieRexHandler = scope.movieRex();
            scope.titleClicked = function( title ) {
                movieRexHandler(title.id, title.title);
            };
                        
//            timeoutId = $interval(function() {
//                console.log(scope.searchContainer);
//            }, 1000);            
        }
    };
}]);


