

homeControllers.directive( 'fsTitle', function(){
    return {
        restrict: 'A',
        templateUrl: 'templates/fs-title.html',
//        scope: {
//            title: "="
//        },
        link: function( scope, element, attrs ) {
            element.bind('click', function() {
                console.log(attrs);
                scope.movieRex(attrs.id, attrs.title);
            });
        }
    };
});


