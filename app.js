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
    'crAuth',
    
    'crComponents',
    'crUser',
    'crCalendar',
    'commonServices',
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

.value('crUserNavData',{
 
        'examiner':{
            calendar:{
                title: 'Calendar',
                path: '/user/calendar'
            },
            messages:{
                title:'Messages',
                path: '/user/messages'
            },
            punani:{
                title:'Punani',
                path: '/user/punani'
            }
        },
        'student':{
            examiners:{
                title: 'Examiners',
                path: '/user/list-of-examiners'
            },
            messages:{
                title:'Messages',
                path: '/user/messages'
            },

        
    }
})

