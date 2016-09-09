angular.module('crRoutes',['ngRoute'])
.config(['$routeProvider', '$locationProvider', '$logProvider', 'RoutePaths', function($routeProvider, $locationProvider, $logProvider, RoutePaths){
    
    
    $routeProvider
    .when('/', {
        templateUrl : 'app/components/search/search.html'
    })
    .when( RoutePaths.login.path, {
        templateUrl:'app/sessions/login.html',
        controller:"crAuthCtrl",
        controllerAs:"auth"
    })
    .when( RoutePaths.signUp.path, {
            templateUrl: 'app/users/views/create-user.html'
    })

    .when('/user/profile', {
        templateUrl: 'app/users/views/profile.html'            
    })
    .when('/user/calendar', {
        templateUrl: 'app/users/views/calendar.html'            
    })

    //Author: Jordan
    .when("/log-in",{
        templateUrl:'app/sessions/login.html',
        controller: 'crAuthCtrl',
        controllerAs: 'auth'
    })
    .when("/createAccount", {
        templateUrl: 'app/sessions/createAccountPage.html'
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
        templateUrl:'app/users/views/examinerList.html',
        controller:"examinerListController"
    })
    .when("/student/examinerProfile",{
        templateUrl: "app/users/views/examinerInfo.html",
        controller: "examinerInfoController"
    })
    .when("/student/messages",{
        templateUrl:"app/users/views/studentMessages.html"
    })


    .otherwise({
        redirectTo:'/'
        
    })
    //End Author
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