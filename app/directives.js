(function(){

	angular.module('pcDirectives',[])

		//HEADER
		.directive('crHeader', function(){
			return{
				templateUrl: function(){
                    
                return 'app/layout/header.html?'+Date.now()},
				scope: true,
				transclude: false,
				replace:true,
				controller:['$scope','pcServices','AuthService',function($scope,pcServices,AuthService){
                    var auth = pcServices.getCommonRefs().main.getAuth();
                     $scope.logout = function(){
                        AuthService.logout(AuthService.auth())
                    }
                    $scope.currentUser =  pcServices.getCookieObj("currentUser");  
                    $scope.$on('$routeChangeSuccess', function (){
                        var user = pcServices.getCookieObj("currentUser");  
                        if(user){
                            $scope.currentUser = user ;
                        }
						  $scope.loggedIn = (pcServices.getPath().indexOf('/user/') > -1);
					  })
				}]
			};
		})

		//SIDEBAR
		.directive('crSidebar', ['pcServices', function(pcServices){
			var user = pcServices.getCookieObj('currentUser');
			var role = user ? user.role : null;
			return{
				restrict:'E',
				templateUrl: 'app/layout/sidebar.html',
				scope: true,
				transclude: false,
				controller: 'crSidebarCtrl',
				controllerAs: 'sidebar'
			}
		}])


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
				scope: true,
				controller: function crNavCtrl($scope){
					$scope.navItems = function(){
						var currentUser = pcServices.getCookieObj('currentUser');
                        console.log($scope);
						if(currentUser){
							switch(currentUser.role){
								case 'examiner' : return crUserNavData.examiner;
								case 'student' : return crUserNavData.student;
								default : return null;
							};
						}
						var currentUser = pcServices.getCookieObj('currentUser');
						if(currentUser){
							switch(currentUser.role.toLowerCase()){
								case 'examiner' : return crUserNavData.examiner;
								case 'student' : return crUserNavData.student;
								default : return null;
				        };
                    }	
                }();
            }
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
                    console.log($scope);
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
                scope:false
				//controller: "AuthCtrl as auth"
			}
		}])

})()

	


