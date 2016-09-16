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



.config(['$locationProvider','$logProvider', function($locationProvider,$logProvider){
    $locationProvider.html5Mode(true).hashPrefix('!');
    $logProvider.debugEnabled(true);
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
    },
    firebase:{
        ref:"https://checkride.firebaseio.com"
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
            profile:{
                title:'Profile',
                path: '/user/profile'
            }
        },
        'student':{
            Examiners:{
                title: 'Examiners',
                path: '/user/list-of-examiners'
            },
            Messages:{
                title:'Messages',
                path: '/user/messages'
            },
            profile:{
                title:'Profile',
                path: '/user/profile'
            }
    }
})

//vv - Not Being used - vv
.value('firebaseRef', function(){
    var ref = new Firebase('https://checkride.firebaseio.com')
})
