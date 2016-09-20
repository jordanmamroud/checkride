(function(){
	angular.module('pcAuth', ['firebase'])

		.factory("pcAuth", ["$firebaseAuth", "pcServices", function($firebaseAuth, pcServices){
			var ref = pcServices.getCommonRefs().main;
			console.log("pcAuth");
			return $firebaseAuth(ref);
		}])

		.service("UserService", ["$firebase", "$q", "pcServices", "pcAuth", function($firebase, $q, pcServices, pcAuth){

			return {}
		}])

		.service("AuthService", ["$firebaseAuth", "$firebaseArray", "$q", "pcServices", "pcAuth", function($firebaseAuth, $firebaseArray, $q, pcServices, pcAuth){
			var ref = pcServices.getCommonRefs();
			var authObj = $firebaseAuth(ref.main);
			var authObjData = authObj.$getAuth();
			var user = null;


			function getUserObject(uid){
				console.log("getUserObject");
				return pcServices.createFireObj(ref.accounts.child(uid));
			};

			//Leave Blank to get current user
			function getUser(uid){
				console.log("getUser");

				var defer = $q.defer();

				//checks if a user id was passed in, else gets the current users id
				uid = (typeof uid === "undefined") ? uid = null : uid;
				
				if(!uid){
					var authData = pcAuth.$getAuth();
					if(authData){
						uid = authData.uid;
					}
				}

				if(uid){

					//Get the users data object and assign it to the "user" variable
					pcServices.createFireObj(ref.accounts.child(uid))
					.$loaded()
					.then(function(user){
						defer.resolve(user);
					})
					.catch(function(error) {
						defer.resolve(error);
					});
				}

				return defer.promise;
			}



			function login(email, password){
				console.log("login");
				var defer = $q.defer();
				
				//Send email and password to be authenticated
				pcAuth.$authWithPassword({
					email: email,
					password: password
				})

				//Once its authenticated...
				.then(function(authData) {

					//Get the users data object and assign it to the "user" variable
					//pcServices.createFireObj(ref.accounts.child(authData.uid)).$loaded()
					getUser(authData.uid)

					.then(function(user){
						//Store the users object as a cookie named "currentUser"
						pcServices.setCookieObj("currentUser", user);
						defer.resolve(user);
					})

					//If couldnt authenticate....
					.catch(function(error) {
						defer.resolve(error);
					})
				})

				return defer.promise;
			}


			//Accepts auth object as param
			function logout(authObj){
				console.log("logout");
				//Clears current user cookie
				pcServices.setCookieObj("currentUser", null);
				//Unauths session				
				authObj.$unauth();
				console.log(authObj);
				//Redirect to the login page
				pcServices.changePath(pcServices.getRoutePaths().login.path);
			}

			return {
				auth: function(){ 
					return authObj;
				},

				getAuth: function(){
					return authObj.$getAuth();
				},

				login: function(email , password){
					return login(email, password);
				},

				logout: function(authObj){
					return logout(authObj);
				},

				getUser: function(uid){
					//Returns a promise
					return getUser(uid);
				},

				getCurrentUser: function(){
					//Returns a promise
					return getUser();
				}
			}
		}])



		//AUTH CONTROLLER
		.controller("AuthCtrl", ["$scope", "$location", "$timeout", "AuthService", "pcAuth", "pcLoginService", "createAccountService", "$firebaseObject", "pcServices",
									function($scope, $location, $timeout, AuthService, pcAuth, pcLoginService,createAccountService, $firebaseObject, pcServices){
			var authScope = this;
			authScope.authObj = pcAuth;
			authScope.currentUser = setCurrentUser();
			authScope.login = login;
			authScope.logout = logout;
			authScope.sendNewPassword = sendNewPassword;
			authScope.createAccountPage = createAccountPage;
			authScope.createAccount = createAccount;


			/*authScope.authObj.$onAuth(function(authData){
				authScope.authData = authData;
				console.log("Auth Status Changed",authData, "\nExpires:",new Date(authData.expires * 1000));
			});*/


			function login(){
				AuthService.login(authScope.email, authScope.password)
				.then(function(user){
					authScope.currentUser = user;
					pcServices.changePath(pcServices.getRoutePaths().profile.path);
				})
				.catch(function(error){
					console.log("Error", error)
				});

			}

			function logout(){
				AuthService.logout(authScope.authObj)
			}
			
			function setCurrentUser(){

				AuthService.getCurrentUser()
				.then( function(user){
					authScope.currentUser = user;
				})
				.catch(function(reason){
					console.log("Failed to retrieve current user: ", reason);
				});
			}


			function sendNewPassword(){
					pcLoginService.sendNewPassword(authScope.email);
			}

			function createAccountPage(){
					console.log(pcServices.getRoutePaths().signUp);
					pcServices.changePath(pcServices.getRoutePaths().signUp.path);
			}

			function createAccount(){
				var user = {
						name:{ first:authScope.firstName,last: authScope.lastName},
						emailAddress:authScope.emailAddress,
						phone:authScope.phone,
						role: authScope.role
				}

				createAccountService.createUser(user, authScope.password);
			}
		}])


		//CREATE ACCOUNT
		.service('createAccountService',['pcServices', function(pcServices){

			var refs = pcServices.getCommonRefs();
			var createUserAccount = createUserAccount;
			
			function createUserAccount(newUser, userId){
				refs.accounts.child(userId).set(newUser);
				console.log(refs.roles.child(newUser.role.toLowerCase() + "/" + userId));
				refs.roles.child(newUser.role.toLowerCase() + "/" + userId).set({name:newUser.name.first +" " + newUser.name.last});
			}

			return{
				createUser: function(newUser, password){
					refs.main.createUser({
							email: newUser.emailAddress ,
							password: password
						},
						
						function(error, userData){
							if (error) {
								console.log("Error creating user:", error);
							} else {
								createUserAccount(newUser, userData.uid);
							}
					});
				}
			}
		}])
		 

		//LOGIN SERVICE
		.service('pcLoginService', ['pcServices', '$firebaseObject',function(pcServices,$firebaseObject){

			var usersRef = pcServices.getCommonRefs().accounts;

			return{
				login: function(email, pass){
					usersRef.authWithPassword({
						email: email,
						password: pass
					},
					function(error, authData){
						if(error){
										alert("login failed: " + error);
						} else {   
							var userInfo = pcServices.createFireObj(usersRef.child(authData.uid));   
							
							userInfo.$loaded().then(function(){
								console.log(userInfo);
								pcServices.setCookieObj('currentUser', userInfo);
								console.log(pcServices.getCookieObj('currentUser'));
								pcServices.changePath(pcServices.getRoutePaths().profile.path);  
							})

						}
					})
				},
				
				sendNewPassWord: function(email){
					usersRef.resetPassword({
							email: email
						}, 
						function(error) {
							if (error) {
								switch (error.code) {
									case "INVALID_USER":
										alert("The account does not exist");
										break;
									default:
										console.log("Error resetting password:", error);
										break;
								}
							}else{
								console.log("Password reset email sent successfully!");
							}
					});
				}
			}
		}])
})()


//Conflicted Lines
// =======
// 					//Once its authenticated...
// 					.then(function(authData) {

// 						//Get the users data object and assign it to the "user" variable
// 						user = pcServices.createFireObj(ref.accounts.child(authData.uid));
//                         console.log("user",user);
// 						//Once its been loaded...
// 						user.$loaded().then(function(){

// 							//Store the users object as a cookie named "currentUser"
// 							pcServices.setCookieObj("currentUser", user);
// >>>>>>> 00ee287fd14e35f04b6a867359f4fb85e881699c
// =======
// 	.controller("AuthCtrl", ["$scope", "$location", "AuthService", "pcLoginService", "createAccountService", "$firebaseObject", "pcServices","currentUser",
// 		function($scope, $location, AuthService, pcLoginService,createAccountService, $firebaseObject, pcServices,currentUser){

// 		this.auth = AuthService.auth();
// 		this.currentUser = currentUser;
// 			this.login = login;
// 		this.logout = logout;
// 		this.sendNewPassword = sendNewPassword;
// 		this.createAccountPage = createAccountPage;
// 		this.createAccount = createAccount;
            
        
//         //Added by Josh
// 		function logout(){
// 			AuthService.logout(this.auth);
// 		}

// 		function login(){
// 			pcServices.removeCookieObj("currentUser");
// 			pcServices.setCookieObj("currentUser", currentUser);
// 			AuthService.login(this.email, this.password);
// >>>>>>> 00ee287fd14e35f04b6a867359f4fb85e881699c