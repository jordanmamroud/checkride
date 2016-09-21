angular.module('pcControllers',[])

<<<<<<< HEAD
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
=======

	//LAYOUT CONTROLLER
	.controller('LayoutCtrl', ["$scope", "$location", "$mdSidenav", 'pcServices',"crUserNavData", "AuthService", 'RoutePaths', 'globalConst', 
		function($scope, $location, $mdSidenav, pcServices, crUserNavData,AuthService, RoutePaths, globalConst){
			console.log("Layout Controller");
			
			var layout = this;
			var localUser = null;
			layout.user = localUser;
			$scope.isSession = null;
			$scope.showSidebar = null;
			$scope.logoUrl = globalConst.app.logoPath;

			$scope.$on('$routeChangeSuccess', function (){
				$scope.isSession = !(AuthService.getAuth === null);
				$scope.showSidebar = ($location.path().indexOf('/user/') > -1);
			});


			AuthService.getUser()
				.then(function(user){
					layout.user = user;
					navItems();
				})
				.catch(function(err){
					console.log(err);
				})
			

			function navItems(){
				console.log("role",layout.user.role)
				switch(layout.user.role){
					case 'examiner': 
						layout.navItems = crUserNavData.examiner;
						break;
					case 'student':
						layout.navItems = crUserNavData.student;
						break;
					default : layout.navItems = null;
				};
				console.log("NavItems",layout.navItems,crUserNavData.student)
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




		//Keep current user updated
		// $scope.$on("$routeChangeSuccess",function(){
			
		// 	console.log("Local User Before", localUser);

		// 	localUser = pcServices.getCookieObj('user');
			
		// 	console.log("Local User After", localUser);
			
		// 	if(!localUser){
		// 		AuthService.getuser().then(function(user){
		// 			pcServices.setCookieObj('user', user);
		// 			localUser = user;
		// 		});
		// 		console.log("Local User After If", localUser);
		// 	}

		// 	layout.user = localUser;
		// })
>>>>>>> c14467f705ed978789fef30f4c64ee6b32ebcf33
