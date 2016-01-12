

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


