
var homeServices = angular.module('homeServices', [], function($provide, $httpProvider) {

    $httpProvider.interceptors.push('loadingInterceptor');
});

homeServices.filter('to_trusted', ['$sce', function($sce) {
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);

homeServices.value('loadingService', {
    loadingCount: 0,
    isLoading: function() {
        return this.loadingCount > 0;
    },
    requested: function() {
        this.loadingCount++;
    },
    responded: function() {
        this.loadingCount--;
    }
});

homeServices.factory('loadingInterceptor', function(loadingService) {
    return {
        request: function(config) {
            loadingService.requested();
            return config;
        },
        response: function(response) {
            loadingService.responded();
            return response;
        }
    };
});

