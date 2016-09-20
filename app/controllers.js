angular.module('pcControllers',[])


//LAYOUT CONTROLLER
.controller('crLayoutCtrl', ["$scope", "$location", "$mdSidenav", 'pcServices', "AuthService", 'RoutePaths', 'globalConst', 
	function($scope, $location, $mdSidenav, pcServices, AuthService, RoutePaths, globalConst){
		var layout = this;
		var localUser = null;
		layout.user = localUser;
		$scope.isSession = null;
		$scope.showSidebar = null;
		$scope.logoUrl = globalConst.app.logoPath;

		$scope.$on('$routeChangeSuccess', function (){
			$scope.isSession = !(AuthService.getAuth() === null);
			$scope.showSidebar = ($location.path().indexOf('/user/') > -1);
		});


		//Keep current user updated
		$scope.$on("$routeChangeSuccess",function(){
			
			console.log("Local User Before", localUser);

			localUser = pcServices.getCookieObj('currentUser');
			
			console.log("Local User After", localUser);
			
			if(!localUser){
				AuthService.getCurrentUser().then(function(user){
					pcServices.setCookieObj('currentUser', user);
					localUser = user;
				});
				console.log("Local User After If", localUser);
			}

			layout.user = localUser;
		})


		function setUser(){
			console.log("SetUser");
			AuthService.getCurrentUser().then(function(user){
				layout.user = user;
			})
		}

		layout.toggleSidenavLeft = buildToggler('pc-sidenav-left');
		layout.toggleSidenavRight = buildToggler('right');

		function buildToggler(componentId) {
		  return function() {
			$mdSidenav(componentId).toggle();
		  }
		}
}])
 

//HEADER CONTROLLER
.controller('crHeaderCtrl', ["$scope", "$location",'RoutePaths','$cookies', 
	function($scope, $location, RoutePaths, $cookies){ }])

//SIDEBAR CONTROLLER
.controller('crSidebarCtrl', ['$scope', '$cookies', '$location', 
	function($scope,$cookies,$location){ }])

//FOOTER CONTROLLER
.controller('crFooter', ["$scope", 
	function($scope){ }])