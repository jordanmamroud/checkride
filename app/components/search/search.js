(function(){angular.module('pcSearch',[])

//SEARCH CONTROLLER
.controller('SearchCtrl', ['$scope', '$log',"$q", '$timeout', "$firebaseArray",'examiners', 'airports', 'esFactory', 'DataService', 'pcServices', '$sessionStorage',searchCtrl]);

function searchCtrl($scope, $log, $q, $timeout, $firebaseArray,examiners, airports, esFactory, DataService, pcServices,$sessionStorage) {
	var self = this;
	var refs = pcServices.getCommonRefs();
	var userRef = refs.accounts ;

	self.airports = ''
	self.searchText = "";
    
	self.querySearch = querySearch;
	self.searchTextChange = searchTextChange;
	self.selectedItemChange = selectedItemChange;
    self.viewProfile = viewProfile;
    
	self.simulateQuery = true;
	self.isDisabled    = false;
	self.searchBoxAlign = "center center";
	self.hasSearch = false;
	self.fullPage = "layout-fill";
    
    self.categories = ["airplane","rotocraft", "Lighter_Than_Air", "Power_lift"];

    self.ratings = ['sport', 'recreational', 'private', 'commercial', 'flight instructor', 'Airline Transport Pilot'];
    self.classes = ['single-engine','multiengine','land','water', 'gyroplane','helicopter','airship','free ballon'];
    
    self.rating = ''; self.class = ''; self.category='';
    self.filterOut = filterOut;
    
	function querySearch (query) {
	//	var results = query ? self.airports.filter( createFilterFor(query) ) : self.airports, deferred;
        searchApi(query);

		var results = query ? self.airports : self.airports, deferred ; 

        if (self.simulateQuery) {
			deferred = $q.defer();
			$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
			return deferred.promise;
		} else {
			return results;
		}
	}
    
    function filterOut(prop){
        if(self.categories.indexOf(prop) != -1){
            self.category = prop
            var theRef = refs.certifications.child(self.category +"/users");
            self.examiners = pcServices.createFireArray(theRef);
            console.log(theRef.toString());
            self.hasSearch = true;
        }else{
            var theRef = refs.certifications.child(self.category +"/" + prop +"/users");
            self.examiners = pcServices.createFireArray(theRef);
            self.hasSearch = true;
        }
    }
    
	function searchTextChange(text){
	  if(text != ""){

	  }
	}
    
    function onSelect(rating){
        var certRef = refs.certifications.child(rating);
        
    }

    function searchApi(query){
         var settings = {
              "async": true,
              "crossDomain": true,
              "url": "https://airport.api.aero/airport/match/"+query+ "?user_key=778ec1573f3e4555c9cb82e66f2c27bc",
              'dataType': "jsonp",
              "method": "GET",
              "headers": {
                "cache-control": "no-cache",
                "postman-token": "061f9e93-0e70-8c49-a06c-fa8602a6c1bc"
              }
            }
            $.ajax(settings).done(function (response) {
                console.log(response.airports);
                self.airports = response.airports ;
            });
    }
    
	function selectedItemChange(item) {
		self.hasSearch = true;
		self.searchBoxAlign = "center start";
		self.fullPage = "";

        var ref = pcServices.getCommonRefs().main.child('airports/examiners/').child(item.code.toLowerCase()).orderByKey();
		pcServices.createFireArray(ref).$loaded().then(function(val){
			self.examiners = val;
		});
	}
    
	function createFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);
		return function filterFn(airports) {
			return (airports.$id.indexOf(lowercaseQuery) === 0);
		};
	}
    
    function viewProfile(examiner){
		
		var examinerRef = refs.accounts.child(examiner.$id);
		examinerRef.once("value",function(data){
            $sessionStorage.examinerInfo = {$id:data.key, data:data.val()}
		});
		pcServices.changePath(pcServices.getRoutePaths().examinerInfo.path);
	}
}



})()


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  // angular
  //     .module('autocompleteDemo', ['ngMaterial'])
  //     .controller('DemoCtrl', DemoCtrl);

  // function DemoCtrl ($timeout, $q, $log) {
  //   var self = this;

  //   self.simulateQuery = false;
  //   self.isDisabled    = false;

  //   // list of `state` value/display objects
  //   self.states        = loadAll();
  //   self.querySearch   = querySearch;
  //   self.selectedItemChange = selectedItemChange;
  //   self.searchTextChange   = searchTextChange;

  //   self.newState = newState;

  //   function newState(state) {
  //     alert("Sorry! You'll need to create a Constitution for " + state + " first!");
  //   }

  //   // ******************************
  //   // Internal methods
  //   // ******************************

  //   /**
  //    * Search for states... use $timeout to simulate
  //    * remote dataservice call.
  //    */
  //   function querySearch (query) {
  //     var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
  //         deferred;
  //     if (self.simulateQuery) {
  //       deferred = $q.defer();
  //       $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
  //       return deferred.promise;
  //     } else {
  //       return results;
  //     }
  //   }

  //   function searchTextChange(text) {
  //     $log.info('Text changed to ' + text);
  //   }

  //   function selectedItemChange(item) {
  //     $log.info('Item changed to ' + JSON.stringify(item));
  //   }

  //   /**
  //    * Build `states` list of key/value pairs
  //    */
  //   function loadAll() {
  //     var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
  //             Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
  //             Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
  //             Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
  //             North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
  //             South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
  //             Wisconsin, Wyoming';

  //     return allStates.split(/, +/g).map( function (state) {
  //       return {
  //         value: state.toLowerCase(),
  //         display: state
  //       };
  //     });
  //   }

  //   /**
  //    * Create filter function for a query string
  //    */
  //   function createFilterFor(query) {
  //     var lowercaseQuery = angular.lowercase(query);

  //     return function filterFn(state) {
  //       return (state.value.indexOf(lowercaseQuery) === 0);
  //     };

  //   }
  // }


























	
	// ELASTIC SEARCH
	// .service('client', function (esFactory) {
	// 	return esFactory({
	// 		host: 'localhost:9200',
	// 		apiVersion: '2.3',
	// 		log: 'trace'
	// 	});
	// })








	// var ref = new Firebase("https://checkride.firebaseio.com/temp");
	// var airportRef = ref.child("airports");
	// var examinerRef = ref.child("users/roles/examiners");
	// var userRef = ref.child("users/accounts");







	// function getExaminers(username){
	// DataService.getExaminers(username);
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
		DataService.getAirports()
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
		var currUsr = $cookies.getObject('user');
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



// function getAirports(query){

		// 	pcServices.createFireArray(ref)
		// }







		// function getAirports(query){
		// 	query = query.toLowerCase();

		// 	airportRef.orderByChild("IATA").equalTo(query).on("value", function(snapshot){
		// 		self.airports = snapshot.val();
		// 		console.log( snapshot.val() ); 
		// 		if(snapshot.numChildren() > 0){
		// 			snapshot.forEach(function(childSnapshot){

		// 				var airportUsers = childSnapshot.child("users").val();
		// 				console.log("Airport Users",airportUsers);

		// 				angular.forEach(airportUsers, function(value,key){
		// 					console.log("airport > users:" + key);
		// 					userRef.orderByKey().equalTo(key).on("value",function(grandchildSnapshot){
		// 						console.log("airport > users > objects:");
		// 						console.log(grandchildSnapshot.val());
		// 					});
		// 				})
		// 			});
		// 		}
		// 	});
		// };