(function(){

	angular.module('pcDirectives',[])

		//HEADER
		.directive('crHeader', function(){
			return{
				templateUrl: function(){
<<<<<<< HEAD
                    return 'app/layout/header.html?'+Date.now()
                },
				scope: false,
				transclude: false,
				replace:true,
                controller:function($scope){
                    console.log($scope);
                }
			};
		})


		//SIDEBAR NAVIGATION
		.directive('crNavigation', ['crUserNavData', 'pcServices' ,function(crUserNavData, pcServices){
=======
					
				return 'app/layout/header.html?'+Date.now()},
				scope: true,
				transclude: false,
				replace:true,
				controller:['$scope','pcServices','AuthService',function($scope,pcServices,AuthService){
					var auth = pcServices.getCommonRefs().main.getAuth();
					 $scope.logout = function(){
						AuthService.logout(AuthService.auth())
					}
					$scope.user =  pcServices.getCookieObj("user");  
					$scope.$on('$routeChangeSuccess', function (){
						var user = pcServices.getCookieObj("user");  
						if(user){
							$scope.user = user ;
						}
						  $scope.loggedIn = (pcServices.getPath().indexOf('/user/') > -1);
					  })
				}]
			};
		})

/*		//SIDEBAR
		.directive('crSidebar', ['pcServices', function(pcServices){
			var user = pcServices.getCookieObj('user');
			var role = user ? user.role : null;
			return{
				restrict:'E',
				templateUrl: 'app/layout/sidebar.html',
				scope: true,
				transclude: false,
				//controller: 'crSidebarCtrl',
				//controllerAs: 'sidebar'
			}
		}])*/


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

		//NAVIGATION
		.directive('crNavigation', function(){

>>>>>>> c14467f705ed978789fef30f4c64ee6b32ebcf33
			return {
				template:   '<md-content flex layout="column" >'+
								'<md-list>' +
									'<md-list-item ng-repeat="item in layout.navItems" class="md-3-line">'+
										'<div class="md-list-item-text">' +
											'<a href="{{item.path}}">' +
												'<h3>{{item.title}}</h3>' +
											'</a>' +
											
										'</div>' +
									'</md-list-item>' +
								'</md-list>' +
							'</md-content>',
<<<<<<< HEAD
				scope: false
        }
     }])
=======
				scope: true,
			}
	})
>>>>>>> c14467f705ed978789fef30f4c64ee6b32ebcf33

		//ACCOUNT
		.directive('accountDetails', ['pcServices','profileService', "AuthService",function(pcServices,profileService, AuthService){
			return{
				templateUrl:function(){
					return "app/users/views/accountDetails.html?" + Date.now(); 
				},
				scope:false,
				controllerAs:'user',
				controller: function($scope){
<<<<<<< HEAD
                    var refs= pcServices.getCommonRefs();
                    this.currentUser = $scope.currentUser ;
                    this.updateUser = function(ref){
=======
					var refs= pcServices.getCommonRefs();
					this.user = $scope.user ;
					console.log($scope);
					this.updateUser = function(ref){
>>>>>>> c14467f705ed978789fef30f4c64ee6b32ebcf33
						if(this.newPassword){
							profileService.changePassword(refs.accounts.child(this.user.$id), this.oldPassword, this.newPassword, this.emailAddress)
						};
					this.user.$save();
					} 
				}   
			}
		}])
		

		.directive("pcSessionStatus", ['pcServices','profileService', function(pcServices, profileService){
			return {
				templateUrl:function(){
<<<<<<< HEAD
                 return "app/auth/sessionStatus.html?" + Date.now();   
                },
                scope:false,
                controller:function($scope){
                    
                }
            
=======
				 return "app/auth/sessionStatus.html?" + Date.now();   
				},
				scope:false
>>>>>>> c14467f705ed978789fef30f4c64ee6b32ebcf33
				//controller: "AuthCtrl as auth"
			}
		}])

})()

	


//		//FOOTER
//		.directive("crFooter", function(){
//			return{
//				restrict:'E',
//				templateUrl: 'app/layout/footer.html',
//				scope: true,
//				transclude: false,
//				controller: 'crFooterCtrl'
//			}
//		})