(function(){
    
	angular.module('pcRoutes',['ngRoute'])


	.config(['$routeProvider', '$locationProvider', '$logProvider', 'RoutePaths', function($routeProvider, $locationProvider, $logProvider, RoutePaths){
		
        
		$routeProvider
		.when('/', {
			templateUrl : 'app/components/search/search.html',
			controller: 'SearchCtrl as search',
			resolve: {
				airports: function(firebaseRef, $firebaseArray){
					var ref = new Firebase('https://checkride.firebaseio.com/temp/airports');
					return $firebaseArray(ref).$loaded();
				},
				examiners: function(firebaseRef, $firebaseArray){
					var ref = new Firebase('https://checkride.firebaseio.com/temp/users/roles/examiner');
					return $firebaseArray(ref).$loaded();
				}
			}
		})

		.when(RoutePaths.login.path, {
			templateUrl:'app/auth/login.html'
		})

		.when(RoutePaths.signUp.path, {
			templateUrl: 'app/auth/create-account.html'
		})

		.when(RoutePaths.examinerCal.path, {
			templateUrl:"app/users/views/examinerCalendar.html",
			controller:"examinerCalendarController",
			controllerAs:"ev"
		})

		.when(RoutePaths.profile.path, {
			templateUrl: 'app/users/views/profile.html',
			controller:"profileController"
		})

		.when(RoutePaths.examinerMessages.path,{
			 templateUrl:"app/components/messaging/messages.html",
			 controller:"messagesController",
			 controllerAs:"msg",
			 resolve:{
				 conversations:function(pcServices){
					var userInfo = pcServices.getCookieObj('currentUser');
					var refs = pcServices.getCommonRefs();
					var conversationsRef = refs.conversations.child(userInfo.$id);
					var messagesRef = conversationsRef.child("/messages");
					return pcServices.createFireArray(conversationsRef).$loaded()
			}
		}})

		//studentPaths
		.when(RoutePaths.examinerList.path,{
			templateUrl:'app/users/views/examinerList.html',
			controller:"examinerListController",
			controllerAs:'vm'
		})

		.when(RoutePaths.examinerInfo.path,{
				templateUrl: "app/users/views/examinerInfo.html",
				controller: "examinerInfoController",
				controllerAs:'vm'
		})

		.when(RoutePaths.viewExaminerAvailability.path,{
			templateUrl: "app/users/views/examinerAvailability.html",
			controller: "examinerAvailabilityController"
		})
		.when(RoutePaths.studentMessages.path,{
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
			path: '/log-in',
			eula: '/login/eula',
			noSubscription: '/no-subscription',
			myAccount: '/my-account',
			createAccount: '/my-account/create',
			createAccountFromXID: '/my-account/update',
		},
		signUp: {
			name: 'Sign-Up',
			path: '/create-account'
			// more routes here
		},
		examinerCal:{  
			path:'/user/calendar'
		},
		examinerMessages:{
			path:"/user/messages"
		},
		profile:{
			path:"/user/profile"
		},

		//student paths
		examinerInfo:{
			path:"/user/examiner-info"
		},
		examinerList:{
			path:'/user/list-of-examiners'
		},
		viewExaminerProfile:{
			path:"/user/view-profile-info"
		},
		viewExaminerAvailability:{
			path:"/user/view-availability"
		},
		studentMessages:{
			path:"/user/student-messages"
		}
	})

})();
