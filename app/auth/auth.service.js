(function(){
	angular.module('pcAuthService', ['firebase'])
		
		//Auth Service
		.factory("AuthService", ["$firebaseAuth", "$firebaseArray", "$q", "pcServices", 
			function($firebaseAuth, $firebaseArray, $q, pcServices){

			var me = this;
			var ref = pcServices.getCommonRefs().main;
			var auth = $firebaseAuth(ref);
			var authObj = auth.$getAuth();
			var savedUser;

			function getUser(){
				var defer = $q.defer();
				if(authObj){
					pcServices.firebaseObject(ref.child("users/accounts").child(authObj.uid))
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
				var defer = $q.defer();
				
				//Send email and password to be authenticated
				auth.$authWithPassword({
					email: email,
					password: password
				})

				//Once its authenticated...
				.then(function(authData) {
					authObj = auth.$getAuth();
					//Get the users data object and assign it to the "user" variable
					getUser().then(function(user){
						defer.resolve(user);
					})

					//If couldnt authenticate....
					.catch(function(error) {
						defer.reject(error);
					})

				}).catch(function(err){
					defer.reject(err);
				})

				return defer.promise;
			}

			function logout(){
				//Unauths session				
				auth.$unauth();
				savedUser = null;
				//Redirect to the login page
				pcServices.changePath(pcServices.getRoutePaths().login.path);
			}

			function getAuth(){
				return authObj;
			}


			return {
				user:savedUser,
				auth:auth,
				getAuth:getAuth(),
				getUser:getUser,
				login: function(email,password){
					return login(email,password);
					},
				logout: logout,
			}
		}])
})()







				// getAuth: function(){
				// 	return authObj.$getAuth();
				// },

				// getUser: function(uid){
				// 	//Returns a promise
				// 	return getUser(uid);
				// },

				// getuser: function(){
				// 	//Returns a promise
				// 	return getUser();
				// }



/*			var defer = $q.defer();

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

			return defer.promise;*/






			// var ref = pcServices.getCommonRefs();
			// var authObj = $firebaseAuth(ref.main);
			// var authObjData = authObj.$getAuth();
			// var user = null;


			// function getUserObject(uid){
			// 	console.log("getUserObject");
			// 	return pcServices.createFireObj(ref.accounts.child(uid));
			// };

			//Leave Blank to get current user
			// function getUser(uid){
			// 	console.log("getUser");

			// 	var defer = $q.defer();

			// 	//checks if a user id was passed in, else gets the current users id
			// 	uid = (typeof uid === "undefined") ? uid = null : uid;
				
			// 	if(!uid){
			// 		var authData = pcAuth.$getAuth();
			// 		if(authData){
			// 			uid = authData.uid;
			// 		}
			// 	}

			// 	if(uid){

			// 		//Get the users data object and assign it to the "user" variable
			// 		pcServices.createFireObj(ref.accounts.child(uid))
			// 		.$loaded()
			// 		.then(function(user){
			// 			defer.resolve(user);
			// 		})
			// 		.catch(function(error) {
			// 			defer.resolve(error);
			// 		});
			// 	}

			// 	return defer.promise;
			// }
