// read me, removed pcControllers and put the LayoutCtrl in layout.controller.js

// removed pcDirectives and replaced it with pcLayoutDirectives in layout.directives.js, also i took out the accountDetails directive and put it inside of the profile files

// put profileController from user.js(pcUser) and put inside of profile/profile.controller.js (pcProfileController, also took profile.service from there and put it in profile/profile.service.js (pcProfileService)

//put account details directive from directives.js (pcDirectives) inside of profile/profile.directives.js (pcProfileDirectives)

// put all controllers from user.js(pcUser) inside of student/student.controllers.js (pcStudentControolers)

//put messageController from checkride-messages.js into checkrid-messages.controllers.js 
// put directives from checkride-messages.js into checkride-messages.directives.js
// put service from checkride-messages.js into checkride-messages.services.js

//moved sessionStatus.html form app/ auth into app/layout
// moved all student view files from user/views into user/student 
// moved profile.html from user/views into user/profile

(function(){
	'use strict'
	angular.module('checkrider',[
		'ngCookies',
		'ngMaterial',    
		'ngAnimate',
		'ngAria',
        "ngStorage",
		'ui.calendar',
        'angularPayments',
		'firebase',
		'ngRoute',
		'elasticsearch',
		
        'pcLayoutController',
        'pcLayoutDirectives',
        
        'pcProfileController',
        'pcProfileService',
        'pcProfileDirective',
        'pcStudentControllers',
        'pcMessagesController',
        'pcMessagesService',
        
		'pcRoutes',
		'pcAuthService',
        'pcAuthController',
		'pcSearch',
		'pcDataService',
        'pcNotificationsController',
        'pcSchedulerController',
        'pcViewingCalController',
        'calDir',
		'crCalendar.service',
		'pcServices',
//		'messages'    
	])

	.config(['$locationProvider','$logProvider', '$mdThemingProvider',function( $locationProvider,$logProvider,$mdThemingProvider ){
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
            airportsRef:'https://checkride.firebaseio.com/airports',
            usersRef:'https://checkride.firebaseio.com/users'
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
					path: '/user/calendar',
					icon: 'date_range'
				},
				messages:{
					title:'Messages',
					path: '/user/messages',
					icon: 'forum'

				},
				profile:{
					title:'My Profile',
					path: '/user/profile',
					icon: 'person'
                },

                notifications:{
                    title:"notifications",
                    path:"/user/notifications"
                }
			},
			'student':{
				Examiners:{
					title: 'Examiners',
					path: '/user/list-of-examiners',
					icon: 'date_range'
				},
				Messages:{
					title:'Messages',
					path: '/user/messages',
					icon: 'forum'
				},
				profile:{
					title:'Profile',
					path: '/user/profile',
					icon: 'person'
				},
                upcomingAppointments:{
                    title:'Upcoming Appointments',
                    path: 'user/upcomingAppointments',
                    icon:'date_range'
                },
                calendar:{
                    title:'myCalendar',
                    path:'user/calendar',
                    icon:'date_range'
                },
                 notifications:{
                    title:"notifications",
                    path:"/user/notifications"
                }
		}
	})

	//FIREBASE REFERENCES
	.constant('firebaseRefs',function(){
            var rootRef = firebase.database().ref();
            var main =rootRef.child("temp");
			return{
				main: main,
				airports: main.child('airports'),
				certifications: main.child('certifications'),
				conversations: main.child('conversations'),
				calendars: main.child('calendars'),
				accounts:main.child('users/accounts'),
				roles:main.child('users/roles'),
				examiners:main.child('users/roles/examiner'),
				students:main.child('users/roles/student'),
                notifications: main.child("notifications")
			}
	})    
})()