//TODO: add user query service
//Should be one service to accept user type argument (along with other optional) / May have to be multiple services
(function(){
	angular.module('pcDataService',[])
	.service('DataService',["$firebaseArray",'$firebaseObject', 'globalConst', '$q', '$log',"pcServices", function($firebaseArray, $firebaseObject,globalConst,$q, $log,pcServices){
		
		var fbRef = pcServices.getCommonRefs().main;
		var usersRef = fbRef.child("users");
		var userAccountsRef = usersRef.child("accounts");
		var userRolesRef = usersRef.child("roles");

		//New variables
		var data = this;
		data.ref = fbRef;
		function getAirports(){
			var defer = $q.defer();
			var query = data.ref.child("airports").orderByKey().limitToFirst(3);
			var value = $firebaseArray(query).$loaded().then(function(val){
				defer.resolve(val);
			});
			return defer.promise;
		}
        
		return {

			getAirports: getAirports,


			getExaminers: function(query){
				return userAccountsRef.orderByKey().equalTo('jordan').once("value",function(snapshot){
					console.log(snapshot.val());
					return snapshot.val();
				});
			},
				
				



			//TESTING
			getUsers: function(scope,role){
				var ref = new Firebase(globalConst.database.usersRef).limitToFirst(10);
				var data = $firebaseObject(ref);

				return $q(function(resolve,reject){
					data.$loaded()
						.then( function(data){
							return resolve(data);
						})
						.catch(function(error) {
							console.error("There was an Error:", error);
						});
				});
			},

			//TESTING
			getUserData: function(){
				var ref = new Firebase(globalConst.database.usersRef);
				var data = $firebaseObject(ref);
				var data2;

				ref.orderByChild('userData').equalTo('Examiner').once('value',function(snapshot){
					snapshot.forEach(function(subShot){
						console.log(1);
					});
					console.log(snapshot);
				});

			}
		}
		
	}])
})();










				
				
				
				
				/*var e = userAccountsRef.equalTo('jordan');
				console.log(e);
				var obj = $firebaseObject(e);
				
				return $q(function(resolve,reject){
					obj
					.$loaded()
					.then(function(response){
						return resolve(response);
					}) .catch(function(error) {
						return error;
						console.error("There was an Error:", error);
					});
				}
			)*/



			//.limitToFirst(10)





		// function queryDatabase(ref){
			
		// 	$q(function(resolve,reject){
		// 		   ref
		// 				.$loaded()
		// 				.then(function(response){
		// 					return resolve(response);
		// 				}) .catch(function(error) {
		// 					return error;
		// 					console.error("There was an Error:", error);
		// 				});
		// 			}
		// 		)
		// }