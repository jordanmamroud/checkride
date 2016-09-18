
(function(){

	'use strict'
	angular.module('checkrider',[
		'ngCookies',
		'ngMaterial',    
		'ngAnimate',
		'ngAria',
		
		'firebase',
		'ngRoute',
		'elasticsearch',
		
		'pcControllers',
		'pcDirectives',
		'pcRoutes',
		'pcAuth',
		'pcSearch',
		'pcDataService',

		'pcUser',
		'crCalendar',
		'pcServices',
		'messages'    
	])

	.config(['$locationProvider','$logProvider', '$mdThemingProvider', function($locationProvider,$logProvider,$mdThemingProvider){
		$locationProvider.html5Mode(true).hashPrefix('!');
		$logProvider.debugEnabled(true);

		$mdThemingProvider.theme('dark').dark();

		//Not sure where this come from---V
		// Configure a dark theme with primary foreground yellow
		$mdThemingProvider.theme('docs-dark', 'default')
			.primaryPalette('yellow')
			.dark();
	}])


    //Global Constants
    .constant('globalConst', {
        app : {
            name : "Checkrider",
            title : "Checkrider",
            logoPath: "assets/img/Logomakr_2l6boM.png"
        },
        database: {
            ref: 'https://checkride.firebaseio.com/',
            airportsRef: 'https://checkride.firebaseio.com/airports',
            usersRef: 'https://checkride.firebaseio.com/users'
        },
        firebase:{
            ref:"https://checkride.firebaseio.com"
        },
        user : {
            defaultPhotoUrl : "/assets/img/default-avitar.jpg"
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
					title:'My Profile',
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

	//FIREBASE REFERENCES
	.constant('firebaseRefs',function(){
			var main = new Firebase("https://checkride.firebaseio.com/temp");
			return{
				root: new Firebase("https://checkride.firebaseio.com/"),
				main: main,
				airports: main.child('airports'),
				certifications: main.child('certifications'),
				conversations: main.child('conversations'),
				calendars: main.child('calendars'),
				accounts:main.child('users/accounts'),
				roles:main.child('users/roles'),
				examiners:main.child('users/roles/examiner'),
				students:main.child('users/roles/student')
			}
	})

//vv - Not Being used - vv
.value('firebaseRef', function(){
	var ref = new Firebase('https://checkride.firebaseio.com')
})  
    
})();