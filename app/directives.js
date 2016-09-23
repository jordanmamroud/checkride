(function(){

	angular.module('pcDirectives',[])

		//HEADER
		.directive('crHeader', function(){
			return{
				templateUrl: function(){
                    return 'app/layout/header.html?'+Date.now()
                },
				scope: false,
				transclude: false,
				replace:true,
                controller:function($scope){
                  
                }
			};
		})

    
		//NAVIGATION
		.directive('crNavigation', function(){
			return {
				templateUrl:function(){
                    return "app/layout/sidebar.html?" + Date.now();
                },

				scope: true,
                link:function(){
                    console.log('hands')
                },
                controller:function($scope){
                    console.log('bane');
                    console.log("scope", $scope);
                }
                
        }
     })


//		//SIDEBAR NAVIGATION
//		.directive('crNavigation', ['crUserNavData', 'pcServices' ,function(crUserNavData, pcServices){					
//				return {
//                templateUrl:function(){
//                    return 'app/layout/header.html?'+Date.now()},
//				scope: true,
//				transclude: false,
//				replace:true,
//				controller:['$scope','pcServices','AuthService',function($scope,pcServices,AuthService){
//					var auth = pcServices.getCommonRefs().main.getAuth();
//					 $scope.logout = function(){
//						AuthService.logout(AuthService.auth())
//					}
//					$scope.user = pcServices.getCookieObj("user");  
//					$scope.$on('$routeChangeSuccess', function (){
//						var user = pcServices.getCookieObj("user");  
//						if(user){
//							 $scope.user = user ;
//						}
//						  $scope.loggedIn = (pcServices.getPath().indexOf('/user/') > -1);
//					  })
//				}]
//			};
//		}])



		//FOOTER
		.directive("crFooter", function(){
			return{
				restrict:'E',
				templateUrl: 'app/layout/footer.html',
				scope: true,
				transclude: false,
				controller: 'crFooterCtrl'
			}
		})

		//ACCOUNT
		.directive('accountDetails', ['pcServices','profileService', "AuthService", function(pcServices,profileService, AuthService){
			return{
				templateUrl:function(){
					return "app/users/views/accountDetails.html?" + Date.now(); 
				},
				scope:false,
				transclude:false,
				controller: function($scope){
					var refs= pcServices.getCommonRefs();
                    $scope.user= $scope.$resolve.user ;
                        
				}   
			}
		}])
		

		.directive("pcSessionStatus", ['pcServices','profileService', function(pcServices, profileService){
			return {
				templateUrl:function(){

                 return "app/auth/sessionStatus.html?" + Date.now();   
                },
                scope:false,
                controller:function($scope){
                    
                }
			}
		}])

})()

	

