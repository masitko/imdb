

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


homeControllers.directive( 'fsList', function(){
    return {
        restrict: 'E',
        templateUrl: 'templates/fs-list.html',
//        scope: {
//            searchContainer: '=',
//            selectedTitle: '='
//        },
        link: function( scope, element, attrs ) {
        },
        controller: function( $scope, $element ) {
            $scope.clicked = function( title ) {
                $scope.movieRex(title.id, title.title);
            };
        }
    };
});


