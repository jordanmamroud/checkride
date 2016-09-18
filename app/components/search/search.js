angular.module('pcSearch',[])
	
	// ELASTIC SEARCH
	.service('client', function (esFactory) {
		return esFactory({
			host: 'localhost:9200',
			apiVersion: '2.3',
			log: 'trace'
		});
	})

	//SEARCH CONTROLLER
	.controller('SearchCtrl', ['$scope', '$log','examiners', 'airports', 'esFactory', 'dataService', 'pcServices', function ($scope, $log, examiners,airports,  esFactory, dataService, pcServices) {
		var self = this;
		var ref = new Firebase("https://checkride.firebaseio.com/temp");
		var userRef = ref.child("users/accounts");

		self.query = null;
		self.examiners = examiners;
		self.airports = "";
		self.searchText = "";
		self.getAirports = getAirports;
		// self.getUsers = getUsers;
		self.airportArray="";
		self.toArray = pcServices.objToArray; 
		self.log = log;
		self.users = pcServices.createFireArray(userRef);

		function log(i){
			console.log(i);
		}

		self.selectedItems="";
		// var examinerRef = new Firebase('https://checkride.firebaseio.com/temp/users/roles/examiner');
		// 	examinerRef.on("value", function(){

		// 	});

		// var ref = new Firebase("https://checkride.firebaseio.com/temp");
	 	var airportRef = ref.child("airports");
	 	var examinerRef = ref.child("users/roles/examiners");
	 	// var userRef = ref.child("users/accounts");


		function getAirports(query){
			query = query.toLowerCase();

			airportRef.orderByChild("IATA").equalTo(query).on("value", function(snapshot){
				self.airports = snapshot.val();
				
				console.log( snapshot.val() ); 
				if(snapshot.numChildren() > 0){

					snapshot.forEach(function(childSnapshot){

						var airportUsers = childSnapshot.child("users").val();
						console.log(airportUsers);

						angular.forEach(airportUsers, function(value,key){
							console.log("airport > users:" + key);
							userRef.orderByKey().equalTo(key).on("value",function(grandchildSnapshot){
								console.log("airport > users > objects:");
								console.log(grandchildSnapshot.val());
							});

						})
					});
				}
				
			});
		};

	// function getUsers(){

	// 	userRef.on("value", function(snapshot){
	// 		self.users = snapshot.val();
	// 		console.log(self.users);
	// 	});
	// };
 	
 // 	getUsers();
    
    //in order for this to work you have to pull from the list of examiners didnt want to fudge with your shiz but it will take you to selected examiners profile with their data.
     self.viewProfile = viewProfile;
     function viewProfile(examiner){
        var refs= pcServices.getCommonRefs();
        pcServices.removeCookieObj("examinerInfo");
        var examinerRef = refs.accounts.child(examiner.$id);
        examinerRef.once("value",function(data){
            pcServices.setCookieObj("examinerInfo", {$id:data.key(),data:data.val()});
        });
        pcServices.changePath(pcServices.getRoutePaths().examinerInfo.path);
      } 
}])


	// function getExaminers(username){
	// dataService.getExaminers(username);
	// 	.then(function(data){
	// 		this.examiners = data;
	// 		$log.log(this.examiners);
	// 		$log.log('hey');
	// 	})
	// 	.catch(function(error) {
	// 		console.error("Error:", error);
	// 	});
	// }
	
	

	
	
	
	
	
/*    
	function getAirports(){
		dataService.getAirports()
			.then(function(data){
				this.airports = data;
				$log.log(this.airports);
			})
			.catch(function(error) {
				console.error("Error:", error);
			});      
	}*/
	
	




//Firebase Rules
//, "airports":{".indexOn": "City"}



//ELASTIC SEARCH
//    client.cluster.state({
//        metric: [
//        'cluster_name',
//        'nodes',
//        'master_node',
//        'version'
//        ]
//      })
//      .then(function (resp) {
//            $scope.clusterState = resp;
//            $scope.error = null;
//      })
//      .catch(function (err) {
//        $scope.clusterState = null;
//        $scope.error = err;
//
//        // if the err is a NoConnections error, then the client was not able to
//        // connect to elasticsearch. In that case, create a more detailed error
//        // message
//        if (err instanceof esFactory.errors.NoConnections) {
//          $scope.error = new Error('Unable to connect to elasticsearch. ' +
//            'Make sure that it is running and listening at http://localhost:9200');
//        }
//      });




/*
crComponents.controller('crSearchCtrl',["$scope", "$window", "$firebaseArray",'$cookies', function($scope, $window, $firebaseArray, $cookies){

		var ref = new Firebase("https://checkride.firebaseio.com");


		$scope.searchBox=null;
		$scope.examiners=null;

		$scope.search = function(query){
			ref.orderByChild("examiner").on('child_added', function(snapshot){
				$scope.examiners = snapshot.val();
				console.log(snapshot.val().userData);
			});
		};
		var currUsr = $cookies.getObject('currentUser');
		console.log(currUsr);
	}])
*/


//.factory('examinerSearch', ["$firebase", function examinerSearchFactory(searchQuery){   }]);
		

//var authData = ref.getAuth();
//var studentRef = ref.child("student/" + authData.password.email.replace( /[\*\^\.\'\!\@\$]/g , ''));

//$scope.list = $firebaseArray(examinersRef);    

// when the a student clicks schedule button it will go to the profile of the selected examiner
//var goToProfile = function(ref){
	//$scope.scheduleButtonEvent = function(index){
		//ref.child("currentExaminer").set($scope.list[index].userData.emailAddress.replace(/[\*\^\.\'\!\@\$]/g , ''));
		//$window.location.href ="https://checkride.firebaseapp.com/StudentFiles/examinerAvailability.html";
		  //$window.location.href = "../StudentFiles/viewProfileFiles/examinerInfo.html?username=" + 
			//$scope.list[index].userData.emailAddress.replace(/[\*\^\.\'\!\@\$]/g , '');
	//}
//}

//goToProfile(studentRef);


//var ref = new Firebase("https://checkride.firebaseio.com/");
