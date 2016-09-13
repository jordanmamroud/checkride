'use strict'
angular.module('checkrider',[
    'ngCookies',
    'ngMaterial',    
    'ngAnimate',
    'ngAria',
    'firebase',
    'ngRoute',
    'elasticsearch',
    
    'crControllers',
    'crDirectives',
    'crRoutes',
    'crAuth',
    'pcSearch',
    'pcDataService',
    
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
.constant('globalConst', {
    app : {
        name : "Checkrider",
        title : "Checkrider",
        logoPath: "assets/img/checkrider-logo-[unofficial].png"
    },
    database: {
        ref: 'https://checkride.firebaseio.com/',
        airportsRef: 'https://checkride.firebaseio.com/airports',
        usersRef: 'https://checkride.firebaseio.com/users'
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

//vv - Not Being used - vv
.value('firebaseRef', function(){
    var ref = new Firebase('https://checkride.firebaseio.com')
})
