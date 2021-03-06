angular.module('pcRoutes',['ngRoute'])
.config(['$routeProvider', '$locationProvider', '$logProvider', 'RoutePaths', function($routeProvider, $locationProvider, $logProvider, RoutePaths){
    
    
    $routeProvider
        .when('/', {
            templateUrl : 'app/components/search/search.html',
            resolve: 'crSearchCtrl'
        })
        .when( RoutePaths.login.path, {
                templateUrl:'app/sessions/login.html',
            controller:"LoginController",
            controllerAs:"login"
        })
        .when( RoutePaths.signUp.path, {
                templateUrl: 'app/users/views/create-account.html'
                
        })
        .otherwise({
            templateUrl:'app/shared/system/404.html'
        })
        //Author: Jordan
        .when("/log-in",{
            templateUrl:'app/sessions/login.html',
            controller:"crLogin",
            controllerAs:"login"
        })
        .when("/createAccount", {
            templateUrl: 'app/sessions/create-account.html',
            controller:'createUser'
        })
        .when("/examiner/calendar",{
            templateUrl:"app/users/views/examinerCalendar.html",
            controller:"examinerCalendarController",
            controllerAs:"vm"
        })
        .when("/examiner/profile", {
            templateUrl:'app/users/views/profile.html',
            controller:'profileController'
        })
        .when("/examiner/messages",{
            templateUrl:'app/users/views/examinerMessages.html'
        })
        .when("/student",{
            templateUrl:'app/users/views/studentHomePage.html',
            controller:"studentHomePageController"
        })
         .when("/student/examinerList",{
            templateUrl:'app/users/views/examinerList.html',
            controller:"examinerListController"
        })
        .when("/student/examinerProfile",{
            templateUrl: "app/users/views/examinerInfo.html",
            controller: "examinerInfoController",
            controllerAs:"vm"
        })
        .when("/student/messages",{
            templateUrl:"app/users/views/studentMessages.html"
        })
        .when("/student/examinerAvailability",{
            templateUrl:"app/users/views/examinerAvailability.html",
            controller:'examinerAvailabilityController'
    })
        //End Author
        
        
        //Supposed to remove '#' from url but not working on refresh
        //$locationProvider.html5Mode(true);
    }])



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