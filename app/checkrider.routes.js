angular.module('crRoutes',['ngRoute'])
.config(['$routeProvider', '$locationProvider', '$logProvider', 'RoutePaths', function($routeProvider, $locationProvider, $logProvider, RoutePaths){
    
    
    $routeProvider
        .when('/', {
            templateUrl : 'app/components/search/search.html',
            resolve: 'crSearchCtrl'
        })
        .when( RoutePaths.login.path, {
                templateUrl: 'app/shared/user/login.html',
                controller: 'UserServicesCtrl'
        })
        .when( RoutePaths.signUp.path, {
                templateUrl: 'app/shared/user/create-account.html',
                controller: 'UserServicesCtrl'
        })
        .otherwise({
            templateUrl:'app/shared/system/404.html'
        })

        //Author: Jordan
        .when("/log-in",{
            templateUrl:'app/shared/views/user/login/loginPage.html',
            controller:"LoginController",
            controllerAs:"login"
        })
        .when("/createAccount", {
            templateUrl: 'app/shared/views/user/createAccount/createAccountPage.html',
            controller:'createAccountController'
        })
        .when("/examiner/calendar",{
            templateUrl:"app/shared/views/examinerFiles/examinerCalendar/examinerCalendar.html",
            controller:"examinerCalendar"
        })
        .when("/examiner/profile", {
            templateUrl:'app/shared/views/examinerFiles/profile/profile.html',
            controller:'profileController'
        })
        .when("/examiner/messages",{
            templateUrl:'app/shared/views/examinerFiles/examinerMessages.html',
            controller:'messagesController'
        })
         .when("/student",{
            templateUrl:'app/shared/views/StudentFiles/examinerList/examinerList.html',
            controller:"examinerListController"
        })
        .when("/student/examinerProfile",{
            templateUrl: "app/shared/views/studentFiles/viewProfileFiles/examinerInfo/examinerInfo.html",
            controller: "examinerInfoController"
        })
        .when("/student/messages",{
            templateUrl:"app/shared/views/StudentFiles/studentMessages.html"
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