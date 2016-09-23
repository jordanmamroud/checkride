(function(){
	angular.module("pcUserController", [])

	.controller("UserController", ["DataService", function(DataService){
		DataService.getAirports();
	}])

})()