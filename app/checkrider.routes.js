'use strict';
checkrider.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

        $routeProvider
            .when('/', {
                templateUrl : 'app/shared/public/search.html',
                controller : 'index'
            })
            .otherwise({
                templateUrl:'app/shared/system/404.html'
            });
    
    }]);