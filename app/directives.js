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
				
			},
			controller:function($scope){
			}

		}})

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
//=======
//
//		}
//	})
//
//
//	//FOOTER
//	.directive("crFooter", function(){
//		return{
//			restrict:'E',
//			templateUrl: 'app/layout/footer.html',
//			scope: true,
//			transclude: false,
//			controller: 'crFooterCtrl'
//		}
//	})
//
//
//
//
//	//ACCOUNT
//	.directive('accountDetails', ['pcServices','profileService', "AuthService",function(pcServices,profileService, AuthService){
//		return{
//			templateUrl:function(){
//				return "app/users/views/accountDetails.html?" + Date.now(); 
//			},
//			scope:false,
//			controllerAs:'user',
//			transclude:true,
//			controller: function($scope){
//				var refs= pcServices.getCommonRefs();
//				this.user = $scope.user ;
//				this.updateUser = function(ref){
//					if(this.newPassword){
//						profileService.changePassword(refs.accounts.child(this.user.$id), this.oldPassword, this.newPassword, this.emailAddress)
//					};
//				this.user.$save();
//				} 
//			}   
//		}
//	}])
//	
//
//	.directive("pcSessionStatus", ['pcServices','profileService', function(pcServices, profileService){
//		return {
//			templateUrl:function(){
//
//             return "app/auth/sessionStatus.html?" + Date.now();   
//            },
//            scope:false,
//            controller:function($scope){
//                
//            }
//		}
//	}])
//>>>>>>> 52d39470f46f43f3359cb55bcdc2f6c673f5f972

})()

	

