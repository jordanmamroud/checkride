'use strict';
angular.module('checkrider.routes',['ngRoute']);
angular.module('Components.Module',[]);
angular.module('UserServices.Module',[]);


var checkrider = angular.module('checkrider',[
    'checkrider.routes',
    'Components.Module',
    'UserServices.Module',
    'firebase',
    'ui.bootstrap'
    ])

//CONTROLLERS
.controller('index', ["$scope", "$location", function($scope,$location){
    $scope.appName = "Checkrider";    
    $scope.title = "Checkrider";

}])





//Move later
.constant('RoutePaths', {
    login: {
        name: 'Login',
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