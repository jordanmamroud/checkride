(function(){
	angular.module('pcAuthController', ['firebase'])

		//AUTH CONTROLLER
		.controller("AuthCtrl", ["$scope", "$location", "$timeout", "AuthService",  "$firebaseObject", "pcServices",
									function($scope, $location, $timeout, AuthService,  $firebaseObject, pcServices){
			var authScope = this;
			authScope.auth = AuthService.auth;
			authScope.authData = AuthService.getAuth;
			authScope.login = login;
			authScope.logout = logout;

			authScope.auth.$onAuth(function(authData){
				if(!authData){
					logout();
				}else{
					if(!authScope.user){
						getUser();
					}
					$scope.isLoggedIn=true;
				}
				authScope.authData = authData;
			});

			//LOGIN
			function login(){
				AuthService.login(authScope.email, authScope.password)
				.then(function(user){
					authScope.user = user;
					pcServices.changePath(pcServices.getRoutePaths().profile.path);
					$scope.isLoggedIn = true;
				})
				.catch(function(error){
					alert(error);
				})
			}

			//LOGOUT
			function logout(){
				$scope.isLoggedIn = false;
				authScope.user = null;
				AuthService.logout();
			}

			function getUser(){
				if(typeof authScope.user === "undefined" || !authScope.user){
					AuthService.getUser().then(function(user){
						authScope.user = user;
					}).catch(function(err){
						console.log(err);
					})
				}
			}
			
		}])
})()
