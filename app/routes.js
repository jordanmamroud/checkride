(function(){    
	angular.module('pcRoutes',['ui.router'])

	.config(['$stateProvider', '$locationProvider', '$logProvider', 'RoutePaths', routeConfig])
    
	//Move later
	.constant('RoutePaths',RoutePaths())
    
     function routeConfig( $stateProvider, $locationProvider, $logProvider, RoutePaths){
        console.log('hamsersonyseser')

		$stateProvider
		.state('search', {
            url:"/",
			templateUrl :function(){
              return 'app/components/search/search.html?'+ Date.now()  
            } ,
			controller: 'SearchCtrl as search',
			resolve: {
				airports: function( $firebaseArray,pcServices){
					var ref = pcServices.getCommonRefs().airports.child("detail");
					return $firebaseArray(ref).$loaded();
				},
				examiners: function( $firebaseArray,pcServices){
					var ref = pcServices.getCommonRefs().examiners
					return $firebaseArray(ref).$loaded();
				}
			}
		})

		.state("login", {
            url:'/log-in',
			templateUrl:'app/auth/login.html',
            controller:'AuthCtrl',
            controllerAs:'auth'
		})

		.state('signUp', {
            url:RoutePaths.signUp.path,
			templateUrl: 'app/auth/create-account.html',
            controller:"AuthCtrl",
            controllerAs:'auth'
        })

		.state('scheduler', {
            url:RoutePaths.scheduler.path,
			templateUrl:function(){
                return "app/components/calendar/scheduler.html?" +Date.now()
            },
			controller:"schedulerController",
            controllerAs:"ev"
		})

		.state('profile',{
            url:RoutePaths.profile.path,
			templateUrl: 'app/users/profile/profile.html',
            controller:'profileController',
			scope:true
		})

		.state('messaging',{
             url:RoutePaths.messages.path,
			 templateUrl: function(){
              return "app/components/messaging/messages.html?" + Date.now();   
             },
			 controller:"messagesController",
			 controllerAs:"msg"
		})
        
        .state('notifications', {
            url: RoutePaths.notifications.path,
            templateUrl:"app/components/notifications/notifications.html",
            controller:"notificationsController",
            controllerAs:"notify"
        })

		//studentPaths
		.state('list-of-examiners',{
            url:RoutePaths.examinerList.path,
			templateUrl:function(){
                return 'app/users/student/examinerList.html?' + Date.now()
            },
			controller:"examinerListController",
			controllerAs:'vm'
		})

		.state('examinerInfo',{
            url:RoutePaths.examinerInfo.path,
			templateUrl: "app/users/student/examinerInfo.html",
			controller: "examinerInfoController",
			controllerAs:'vm'
		})
        
        .state('upcomingAppointments',{
            url:RoutePaths.upcomingAppointments.path,
            templateUrl:"app/users/student/upcomingAppointments.html",
            controller:"upcomingAppointmentsCtrl"
        })

//      
//		.otherwise({
//			redirectTo:'/'
//
//		})
		//End Author
	}
    
    function RoutePaths(){
        return{
            login: {
                path: '/log-in', 
            },
            signUp: {
                path: '/create-account'
            },
            scheduler:{  
                path:'/user/calendar'
            },
            messages:{
                path:"/user/messages"
            },
            profile:{
                path:"/user/profile"
            },
            notifications:{
                path:"/user/notifications"
            },
            upcomingAppointments:{
                path:"/user/upcomingAppointments"
            },

            //student paths
            examinerInfo:{
                path:"/user/examiner-info"
            },
            examinerList:{
                path:'/user/list-of-examiners'
            }
        }
    }
})()


//name: 'Log in',
//                path: '/log-in',
//                eula: '/login/eula',
//                noSubscription: '/no-subscription',
//                myAccount: '/my-account',
//                createAccount: '/my-account/create',
//                createAccountFromXID: '/my-account/update',