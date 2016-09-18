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
			template:   '<md-content>'+
							'<md-list>' +
								'<md-list-item ng-repeat="item in navItems">'+
									'<a href="{{item.path}}">{{item.title}}</a>' +
								'</md-list-item>' +
							'</md-list>' +
						'</md-content>',
			scope: true,
			controller: function crNavCtrl($scope){
				$scope.navItems = function(){
					var role = pcServices.getCookieObj('currentUser').role.toLowerCase();
					switch(role){
						case 'examiner' : return crUserNavData.examiner;
						case 'student' : return crUserNavData.student;
						default : return null;
					};
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
				this.firstName = userInfo.name.first ;
				this.lastName = userInfo.name.last;
				this.bio = userInfo.bio ;
				this.oldPassword='';
				this.newPassword='';
				this.phoneNumber = userInfo.phoneNumber ;
				this.emailAddress = userInfo.emailAddress ;
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



	


