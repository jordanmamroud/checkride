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
                    console.log($scope);
                }
			};
		})


		//SIDEBAR NAVIGATION
		.directive('crNavigation', ['crUserNavData', 'pcServices' ,function(crUserNavData, pcServices){
			return {
				template:   '<md-content flex layout="column" >'+
								'<md-list>' +
									'<md-list-item ng-repeat="item in navItems" class="md-3-line">'+
										'<div class="md-list-item-text">' +
											'<a href="{{item.path}}">' +
												'<h3>{{item.title}}</h3>' +
											'</a>' +
											
										'</div>' +
									'</md-list-item>' +
								'</md-list>' +
							'</md-content>',
				scope: false
        }
     }])

		//ACCOUNT
		.directive('accountDetails', ['pcServices','profileService', "AuthService",function(pcServices,profileService, AuthService){
			return{
				templateUrl:function(){
                    return "app/users/views/accountDetails.html?" + Date.now(); 
                },
				scope:false,
				controllerAs:'user',
				controller: function($scope){
                    var refs= pcServices.getCommonRefs();
                    this.currentUser = $scope.currentUser ;
                    this.updateUser = function(ref){
						if(this.newPassword){
							profileService.changePassword(refs.accounts.child(this.currentUser.$id), this.oldPassword, this.newPassword, this.emailAddress)
						};
				    this.currentUser.$save();
					} 
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