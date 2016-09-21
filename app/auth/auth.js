(function(){
	angular.module('pcAuth', ['firebase'])

		.service("AuthService", ['$q',"$firebaseAuth", "$firebaseArray", "pcServices", function($q,$firebaseAuth, $firebaseArray, pcServices){
            var ref = pcServices.getCommonRefs();
			var authObj = $firebaseAuth(ref.main);
			var authObjData = authObj.$getAuth();
			var user = null;


            var service = {
                getUser:getUser,
                auth: $firebaseAuth(ref.main),
                getAuth: getAuth,
                login : login,
                //Accepts auth object as param
                logout : logout,
                createUser:createUser                
            }

			return service ;
            

            function getAuth(){
                return authObjData;
            }
            
            function getUser(){
				var defer = $q.defer();
				if(authObjData){
                    console.log(authObjData);
					pcServices.createFireObj(ref.accounts.child(authObjData.uid))
					.$loaded().then(function(user){
						savedUser = user;
						defer.resolve(user);
					}).catch(function(err){
						defer.reject(err);
					})
				}
				return defer.promise;
			}

            
            function login(email, password){
					//Send email and password to be authenticated
					authObj.$authWithPassword({
						email: email,
						password: password
					})

					//Once its authenticated...
					.then(function(authData) {
						//Get the users data object and assign it to the "user" variable
						user = pcServices.createFireObj(ref.accounts.child(authData.uid));
						//Once its been loaded...
						user.$loaded().then(function(){

							//Store the users object as a cookie named "currentUser"
							pcServices.setCookieObj("currentUser", user);

							//And redirect to the users profile page
							pcServices.changePath(pcServices.getRoutePaths().profile.path);

							//Then return the users object
							return authData;
						})
					})

					//If couldnt authenticate....
					.catch(function(error) {
						return error;
						console.error("Authentication failed:", error);
					});
            }
                     
            function logout(authObj){
					//Clears current user cookie
					pcServices.setCookieObj("currentUser", null);
					//Unauths session				
					authObj.$unauth();
					//Redirect to the login page
					pcServices.changePath(pcServices.getRoutePaths().login.path);
            }
            
            function createUser(newUser, password){
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
            
            //				getCurrentUser : function(){
//					if(authObjData){
//						return pcServices.createFireObj(ref.accounts.child(authObjData.uid));
//					}
//				}
		}])



		//AUTH CONTROLLER
		.controller("AuthCtrl", ["$scope", "$location", "AuthService", "pcLoginService", "createAccountService", "$firebaseObject", "pcServices","currentUser",
            function($scope, $location, AuthService, pcLoginService,createAccountService, $firebaseObject, pcServices,currentUser){

			this.auth = AuthService.auth;
            this.currentUser = currentUser;
 			this.login = login;
			this.logout = logout;
			this.sendNewPassword = sendNewPassword;
			this.createAccountPage = createAccountPage;
			this.createAccount = createAccount;
                
            
            //Added by Josh
			function logout(){
				AuthService.logout(this.auth);
			}

			function login(){
                pcServices.removeCookieObj("currentUser");
                pcServices.setCookieObj("currentUser", currentUser);
				AuthService.login(this.email, this.password);
                $scope.$parent.currentUser = currentUser ;
			}

			function sendNewPassword(){
					pcLoginService.sendNewPassword(this.email);
			}

			function createAccountPage(){
					console.log(pcServices.getRoutePaths().signUp);
					pcServices.changePath(pcServices.getRoutePaths().signUp.path);
			}

			function createAccount(){
				var user = {
						name:{ first:$scope.firstName,last: $scope.lastName},
						emailAddress:$scope.emailAddress,
						phone:$scope.phone,
						role: $scope.role
				}

				createAccountService.createUser(user, $scope.password);
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