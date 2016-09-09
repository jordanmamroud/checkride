'use strict'
angular.module('checkrider',[
    'ngCookies',
    'ngMaterial',    
    'ngAnimate',
    'ngAria',
    'firebase',
    'ngRoute',
    
    'crControllers',
    'crDirectives',
    'crRoutes',
    
    'crComponents',
    'crUserServices',
    'crUser',
    'crAuth',
    'commonServices',
    'crCalendar',
    'messages'    
    ])



.config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(true).hashPrefix('!');
}])



//Global Constants
.constant('GlobalConstants', {
    app : {
        name : "Checkrider",
        title : "Checkrider",
        logoPath:"assets/img/checkrider-logo-[unofficial].png"
    }
})