(function(){angular.module('pcSearch',[])

//SEARCH CONTROLLER
.controller('SearchCtrl', ['$filter','$scope', '$log',"$q", '$timeout', "$firebaseArray",'examiners', 'airports', 'esFactory', 'DataService', 'pcServices', '$sessionStorage', searchCtrl ]);

function searchCtrl($filter,$scope, $log, $q, $timeout, $firebaseArray,examiners, airports, esFactory, DataService, pcServices,$sessionStorage) {
	var self = this;
	var refs = pcServices.getCommonRefs();
	var userRef = refs.accounts ;
    
       var mapsRequest= {
            url:"https://blooming-river-27917.herokuapp.com/gmapreq?url=http://maps.googleapis.com/maps/api/geocode/json?address=08901&key=AIzaSyAP1qGdGeoLizmASNHuCbBmj0A--M3T31o",
            type:"GET",
            error:function(er,arr,thr){
                console.log(thr)
            }
        }

        $.ajax(mapsRequest).done(function(res){
            console.log(JSON.parse(res));
            var location = JSON.parse(res).results[0].geometry.location;
            self.lat = location.lat ;
            self.lng = location.lng;

        })  
        
    function distance(lon1, lat1, lon2, lat2) {
        console.log(lon1,lat1,lon2,lat2)
          var R = 6371; // Radius of the earth in km
          var dLat = (lat2-lat1) * Math.PI / 180;  // Javascript functions in radians
          var dLon = (lon2-lon1) * Math.PI / 180; 
          var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2); 
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
          var d = R * c; // Distance in km
        
          return d;
    }

    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert( "User denied the request for Geolocation.")
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.")
                break;
            case error.TIMEOUT:
               alert( "The request to get user location timed out.")
                break;
            case error.UNKNOWN_ERROR:
                alert( "An unknown error occurred.")
                break;
        }
    }
    
    
    self.filters =  '';
    self.searchInput = true ;

	self.airports = ''
	self.searchText = "";
    
	self.querySearch = querySearch;
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
    
    self.rating = null; self.class = null ; self.category=null;
    self.filterOut = filterOut;
    self.user = pcServices.createFireObj(refs.user);
    
	function querySearch (query) {
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
    
//    $timeout(function(){
//        
//    })
    
    function filterOut(prop){

        if(self.categories.indexOf(prop)!= -1){self.category = prop;} ;
        if(self.ratings.indexOf(prop)!= -1){self.rating = prop } ;
        if(self.classes.indexOf(prop)!= -1){self.class = prop } ;   
    
        if(self.category && !self.rating){
            var filteredExaminers = refs.certifications.child(self.category);
            self.examiners = pcServices.createFireArray(filteredExaminers);
            self.hasSearch =true
        }
        var filteredExaminers = refs.certifications.child(self.category);
        self.examiners = pcServices.createFireArray(filteredExaminers);
        self.examiners.$loaded().then(function(){
            var latlon = self.lat + "," + self.lng ;
            for(var i =0; i<self.examiners.length; i++){
                var distanceToUser = distance(self.lng,self.lat, self.examiners[i].mainAirport.lng , self.examiners[i].mainAirport.lat);
                console.log(distanceToUser);
                self.examiners[i].distance = parseFloat(distanceToUser * 0.62137).toFixed(2).toString();
            }
        });  
        
        if(self.category && self.rating){
            self.my = function(examiner){
                if(examiner.rating.hasOwnProperty(self.rating)){
                    if(self.class){
                        for(var b in examiner.rating){
                           if(examiner.rating[b].hasOwnProperty(self.class)){
                                return true
                            }
                        }
                    }else{
                            return true;
                    }
                }   
                else{
                    return false
                }
            }
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
			self.examiners = val ;
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