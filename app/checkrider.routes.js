'use strict';
checkrider.config(['$routeProvider', '$locationProvider', 'RoutePaths', function($routeProvider, $locationProvider, RoutePaths){
    
        $routeProvider
            .when('/', {
                templateUrl : 'app/shared/public/search.html',
                controller : 'index'
            })
            .when( RoutePaths.login.path, {
                    templateUrl: 'app/shared/user/login.html',
                    controller: 'LoginController'
            })
            .when( RoutePaths.signUp.path, {
                    templateUrl: 'app/shared/user/create-account.html',
                    controller: 'LoginController'
            })
            .otherwise({
                templateUrl:'app/shared/system/404.html'
            });
        
        //Supposed to remove '#' from url but not working on refresh
        //$locationProvider.html5Mode(true);
    }]);

//DIRECTIVES
checkrider.directive("header", function(){
    return{
        templateUrl: 'app/shared/templates/header.html',
        scope: true,
        transclude: false,
        controller: 'HeaderController as header'
    };
})

.directive("footer", function(){
    return{
        templateUrl: '../app/shared/templates/footer.html',
        scope: true,
        transclude: false,
        controller: 'FooterController'
    };
})
