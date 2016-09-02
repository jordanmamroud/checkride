angular.module('Checkrider.Routes',['ngRoute'])
.config(['$routeProvider', '$locationProvider', 'RoutePaths', function($routeProvider, $locationProvider, RoutePaths){
    
        $routeProvider
            .when('/', {
                templateUrl : 'app/shared/public/search.html',
                controller : 'index'
            })
            .when( RoutePaths.login.path, {
                    templateUrl: 'app/shared/user/login.html',
                    controller: 'UserServices'
            })
            .when( RoutePaths.signUp.path, {
                    templateUrl: 'app/shared/user/create-account.html',
                    controller: 'UserServices'
            })
            .otherwise({
                templateUrl:'app/shared/system/404.html'
            });
        
        //Supposed to remove '#' from url but not working on refresh
        //$locationProvider.html5Mode(true);
    }])

//DIRECTIVES
.directive("header", function(){
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

//Move later
.constant('RoutePaths', {
    login: {
        name: 'Log in',
        path: '/login',
        eula: '/login/eula',
        noSubscription: '/no-subscription',
        myAccount: '/my-account',
        createAccount: '/my-account/create',
        createAccountFromXID: '/my-account/update',
        // more routes here
    },
    signUp: {
        name: 'Sign-Up',
        path: '/create-account'
        // more routes here
    }
    // more objects here
})