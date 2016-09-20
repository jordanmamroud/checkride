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































			//authScope.sendNewPassword = sendNewPassword;
			//authScope.createAccountPage = createAccountPage;
			//authScope.createAccount = createAccount;



			// AuthService.getUser(function(user){
			// 	authScope.user = user;
			// 	console.log("New User",user)
			// });
/*			function setuser(){

				AuthService.getUser()
				.then( function(user){
					authScope.user = user;
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
			}*/





























		//CREATE ACCOUNT
		// .service('createAccountService',['pcServices', function(pcServices){

		// 	var refs = pcServices.getCommonRefs();
		// 	var createUserAccount = createUserAccount;
			
		// 	function createUserAccount(newUser, userId){
		// 		refs.accounts.child(userId).set(newUser);
		// 		console.log(refs.roles.child(newUser.role.toLowerCase() + "/" + userId));
		// 		refs.roles.child(newUser.role.toLowerCase() + "/" + userId).set({name:newUser.name.first +" " + newUser.name.last});
		// 	}

		// 	return{
		// 		createUser: function(newUser, password){
		// 			refs.main.createUser({
		// 					email: newUser.emailAddress ,
		// 					password: password
		// 				},
						
		// 				function(error, userData){
		// 					if (error) {
		// 						console.log("Error creating user:", error);
		// 					} else {
		// 						createUserAccount(newUser, userData.uid);
		// 					}
		// 			});
		// 		}
		// 	}
		// }])




























		 

		//LOGIN SERVICE
		// .service('pcLoginService', ['pcServices', '$firebaseObject',function(pcServices,$firebaseObject){

		// 	var usersRef = pcServices.getCommonRefs().accounts;

		// 	return{
		// 		login: function(email, pass){
		// 			usersRef.authWithPassword({
		// 				email: email,
		// 				password: pass
		// 			},
		// 			function(error, authData){
		// 				if(error){
		// 								alert("login failed: " + error);
		// 				} else {   
		// 					var userInfo = pcServices.createFireObj(usersRef.child(authData.uid));   
							
		// 					userInfo.$loaded().then(function(){
		// 						console.log(userInfo);
		// 						pcServices.setCookieObj('user', userInfo);
		// 						console.log(pcServices.getCookieObj('user'));
		// 						pcServices.changePath(pcServices.getRoutePaths().profile.path);  
		// 					})

		// 				}
		// 			})
		// 		},
				
		// 		sendNewPassWord: function(email){
		// 			usersRef.resetPassword({
		// 					email: email
		// 				}, 
		// 				function(error) {
		// 					if (error) {
		// 						switch (error.code) {
		// 							case "INVALID_USER":
		// 								alert("The account does not exist");
		// 								break;
		// 							default:
		// 								console.log("Error resetting password:", error);
		// 								break;
		// 						}
		// 					}else{
		// 						console.log("Password reset email sent successfully!");
		// 					}
		// 			});
		// 		}
		// 	}
		// }])


//Conflicted Lines
// =======
// 					//Once its authenticated...
// 					.then(function(authData) {

// 						//Get the users data object and assign it to the "user" variable
// 						user = pcServices.createFireObj(ref.accounts.child(authData.uid));
//                         console.log("user",user);
// 						//Once its been loaded...
// 						user.$loaded().then(function(){

// 							//Store the users object as a cookie named "user"
// 							pcServices.setCookieObj("user", user);
// >>>>>>> 00ee287fd14e35f04b6a867359f4fb85e881699c
// =======
// 	.controller("AuthCtrl", ["$scope", "$location", "AuthService", "pcLoginService", "createAccountService", "$firebaseObject", "pcServices","user",
// 		function($scope, $location, AuthService, pcLoginService,createAccountService, $firebaseObject, pcServices,user){

// 		this.auth = AuthService.auth();
// 		this.user = user;
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
// 			pcServices.removeCookieObj("user");
// 			pcServices.setCookieObj("user", user);
// 			AuthService.login(this.email, this.password);
// >>>>>>> 00ee287fd14e35f04b6a867359f4fb85e881699c