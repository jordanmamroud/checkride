angular.module('pcControllers',[])


//LAYOUT CONTROLLER
.controller('crLayoutCtrl', ["$scope", "$location",'$cookies', "$mdSidenav", "AuthService", 'RoutePaths', 'globalConst', 
	function($scope, $location, $cookies, $mdSidenav, AuthService, RoutePaths, globalConst){
		var layout = this; 
        layout.user = $cookies.getObject('currentUser');
    	$scope.isSession = null;
        $scope.showSidebar = null;
        $scope.logoUrl = globalConst.app.logoPath;

        $scope.$on('$routeChangeSuccess', function (){
        	$scope.isSession = !(AuthService.getAuth() === null);
            $scope.showSidebar = ($location.path().indexOf('/user/') > -1);
        });


        layout.toggleSidenavLeft = buildToggler('pc-sidenav-left');
        layout.toggleSidenavRight = buildToggler('right');

        function buildToggler(componentId) {
          return function() {
            $mdSidenav(componentId).toggle();
          }
        }
}])
 

//HEADER CONTROLLER
.controller('crHeaderCtrl', ["$scope", "$location",'RoutePaths','$cookies', function($scope, $location, RoutePaths, $cookies){ }])

//SIDEBAR CONTROLLER
.controller('crSidebarCtrl', ['$scope', '$cookies', '$location', function($scope,$cookies,$location){ }])

//FOOTER CONTROLLER
.controller('crFooter', ["$scope", function($scope){ }])