'use strict';
checkrider.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

        $routeProvider
            .when('/', {
                templateUrl : 'app/components/search/search.html',
                controller : 'index'
            })
            .otherwise({
                templateUrl:'app/site/404.html'
            });
    
    }]);