angular.module('pcControllers',[])

.run(function(){
    
})
//LAYOUT CONTROLLER
.controller('crLayoutCtrl', ["$timeout","$scope","crUserNavData", "$mdSidenav", 'globalConst', 'pcServices','AuthService','$q',
	function($timeout,$scope,crUserNavData, $mdSidenav, globalConst,pcServices,AuthService,$q){
		var layout = this; 
        layout.toggleSidenavLeft = buildToggler('pc-sidenav-left');
        layout.toggleSidenavRight = buildToggler('right');
        
    	$scope.isSession = null ;
        $scope.showSidebar = null ;
        $scope.logoUrl = globalConst.app.logoPath ;
        $scope.logout = logout ; 
        
//        $scope.currentUser = AuthService.getUser().then(function(obj){
//            $scope.currentUser = obj;
//        });
//        
        $scope.$on('$routeChangeSuccess', setUpLayout);
        
        function logout(){
            AuthService.logout(AuthService.auth);
        }
        
        function setUpLayout(event,next){
            var user = next.$$route.resolve.currentUser(pcServices);
            if(user){
                user.then(function(user){
                        $scope.isSession= true ;    
                        $scope.currentUser = user;
                        $scope.navItems = setNavItems(user) ;        
                });
            }
            $scope.showSidebar = (pcServices.getPath().indexOf('/user/') > -1);
        }
        
        function setNavItems(user){
            if(user){
                switch(user.role.toLowerCase()){
                    case 'examiner' : return crUserNavData.examiner;
                    case 'student' : return crUserNavData.student;
                    default : return null;
                };
            }
        };
        
        function buildToggler(componentId) {
          return function(){
            $mdSidenav(componentId).toggle();
          }
        }
}])
 

//HEADER CONTROLLER
.controller('crHeaderCtrl', ["$scope", "$location",'RoutePaths','$cookies', function($scope, $location, RoutePaths, $cookies){ }])

//SIDEBAR CONTROLLER
.controller('crSidebarCtrl', ['$scope', '$cookies', '$location', function($scope,$cookies,$location){ }])

//FOOTER CONTROLLER
.controller('crFooter', ["$scope", function($scope){ }]);