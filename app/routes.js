(function(){
    
	angular.module('pcRoutes',['ngRoute'])
    

	.config(['$routeProvider', '$locationProvider', '$logProvider', 'RoutePaths', function( $routeProvider, $locationProvider, $logProvider, RoutePaths){
        
        var originalWhen = $routeProvider.when;
            $routeProvider.when = function(path, route) {
                route.resolve || (route.resolve = {});
                angular.extend(route.resolve, {
                    "user" : function(pcServices){
                        var ref = pcServices.getCommonRefs();
                        var authObjData = ref.main.getAuth();
                        if(authObjData){
                            var user = pcServices.createFireObj(ref.accounts.child(authObjData.uid));
                            if(user){
                                return user.$loaded();
                            }else{
                                return null ;
                            }
                        }
                }
            });
            return originalWhen.call($routeProvider, path, route);
        }
        
		$routeProvider
		.when('/', {
			templateUrl : 'app/components/search/search.html',
			controller: 'SearchCtrl as search',
			resolve: {
				airports: function(firebaseRef, $firebaseArray){
					var ref = new Firebase('https://checkride.firebaseio.com/temp/airports/detail');
					return $firebaseArray(ref).$loaded();
				},
				examiners: function(firebaseRef, $firebaseArray){
					var ref = new Firebase('https://checkride.firebaseio.com/temp/users/roles/examiner');
					return $firebaseArray(ref).$loaded();
				}
			}
		})

		.when(RoutePaths.login.path, {
			templateUrl:'app/auth/login.html',
		})

		.when(RoutePaths.signUp.path, {
			templateUrl: 'app/auth/create-account.html',
            controller:'AuthCtrl'
		})

		.when(RoutePaths.examinerCal.path, {
			templateUrl:"app/users/views/examinerCalendar.html",
			controller:"examinerCalendarController",
			controllerAs:"ev"
		})

		.when(RoutePaths.profile.path, {
			templateUrl: 'app/users/views/profile.html',
			scope:true

		})

		.when(RoutePaths.examinerMessages.path,{
			 templateUrl:"app/components/messaging/messages.html",
			 controller:"messagesController",
			 controllerAs:"msg",
			 resolve:{
				 conversations:function(pcServices){
					var userInfo = pcServices.getCookieObj('user');
					var refs = pcServices.getCommonRefs();
					var conversationsRef = refs.conversations.child(userInfo.$id);
					var messagesRef = conversationsRef.child("/messages");
					return pcServices.createFireArray(conversationsRef).$loaded()
			}
		}})
        
        .when(RoutePaths.notifications.path, {
            templateUrl:"app/components/notifications/notifications.html",
            controller:"notificationsController",
            controllerAs:"notify"
        })

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
		},
        notifications:{
            path:"/user/notifications"
        }
        
	})

})();
