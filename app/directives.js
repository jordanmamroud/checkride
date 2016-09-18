(function(){

	angular.module('pcDirectives',[])

		//HEADER
		.directive('crHeader', function(){
			return{
			
				templateUrl: 'app/layout/header.html',
				scope: true,
				transclude: false,
				controllerAs:"header",
				replace:true
				//controller:['$scope','pcServices',function($scope,pcServices){
					 //Moved to auth.js
					 //this.loggedIn = false;
					 // $scope.$on('$routeChangeSuccess', function (){
						//  $scope.hd.loggedIn = (pcServices.getPath().indexOf('/user/') > -1);
					 // })
				//}]
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


		//MODAL
		.directive("showModal", function(){
			return{
			   link: function(scope,element,attrs){
				   $(element).on("click", function(){
						$(scope.modalToOpen).addClass('showing');
				   })
			   }, 
			   scope:{
					modalToOpen:"@modalToOpen",
					openFunc:"&"
				}
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
						console.log('Bam ', pcServices.getCookieObj('currentUser'))
						var currentUser = pcServices.getCookieObj('currentUser');
						if(currentUser){
							switch(currentUser.role.toLowerCase()){
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
				templateUrl:"app/users/views/accountDetails.html",
				scope:false,
				controllerAs:'user',
				controller: function(){
					var userInfo = pcServices.getCookieObj('currentUser');

					this.currentUser = AuthService.getCurrentUser();

					this.updateUser = function(ref){
						if(this.newPassword.length>0){
							profileService.changePassword(userRef, this.oldPassword, this.newPassword, userInfo.emailAddress)
						};
						this.currentUser.$save();
					} 
				}   
			}
		}])
		

		.directive("pcSessionStatus", ['pcServices','profileService', function(pcServices, profileService){
			return {
				templateUrl: "app/auth/sessionStatus.html",
				//controller: "AuthCtrl as auth"
			}
		}])

})()

	


