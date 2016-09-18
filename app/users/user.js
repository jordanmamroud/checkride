(function(){

	angular.module("pcUser",[])

		//Shared Controllers
		.controller("profileController", ['$scope','profileService', 'pcServices', 'currentUser',function($scope, profileService,pcServices,currentUser){
			var refs = pcServices.getCommonRefs();
			var userInfo = pcServices.getCookieObj("currentUser");
			var userRef = pcServices.getCommonRefs().accounts.child(userInfo.$id);
            $scope.role = '';
			switch(userInfo.role.toLowerCase()){
				case 'examiner' : 
					$scope.role ='examiner'
					break;
				case 'student' : 
					$scope.role = 'student' 
					break ;
			};
            $scope.certificationsList = pcServices.createFireArray(userRef.child("certifications"));

			$scope.airportsList = pcServices.createFireArray(userRef.child("airports"));

			$scope.saveCertification = function(chip){
				  if(chip.hasOwnProperty("$id") == false){
					  userRef.child("certifications/" + chip).set(true);
					  refs.certifications.child(chip + "/users/" + userInfo.$id).set(true);
					  return null ;
				}
			}
            
			$scope.saveAirport= function(chip){
				if(chip.hasOwnProperty("$id") == false){
					userRef.child("airports/" + chip).set(true);
					refs.airports.child(chip + "/users/" + userInfo.$id).set(true);
					return null ;
				}
			}
            
			$scope.deleteAirport = function(chip){
				userRef.child("airports/" + chip.$id).remove();
				refs.airports.child(chip.$id+"/users/" +userInfo.$id).remove();
			}
            
			$scope.deleteCertication = function(chip){
				userRef.child("certifications/" + chip.$id).remove();
				refs.certifications.child(chip.$id+"/users/" +userInfo.$id).remove();
			}
		}])

		// STUDENT CONTROLLERS
		.controller('examinerAvailabilityController', ['$scope', 'pcServices',function($scope, pcServices){
			var userInfo = pcServices.getCookieObj("currentUser");
			console.log(userInfo);
			$scope.studentName = userInfo.name.first +" " + userInfo.name.last ;
		 }])


		.controller('examinerListController',["$scope",'$location','pcServices',function($scope,$location,pcServices){
			var vm = this ;
			var refs= pcServices.getCommonRefs();     
			vm.viewProfile  = viewProfile ;
			vm.examiners = pcServices.createFireArray(refs.examiners);

			function viewProfile(examiner){
				console.log(examiner);
				pcServices.removeCookieObj("examinerInfo");
				var examinerRef = refs.accounts.child(examiner.$id);
				examinerRef.once("value",function(data){
					pcServices.setCookieObj("examinerInfo", {$id:data.key(),data:data.val()});
					console.log(pcServices.getCookieObj('examinerInfo'));
					pcServices.changePath(pcServices.getRoutePaths().examinerInfo.path);
				});
			  }    
		}])

		.controller('examinerInfoController', ['$scope', 'pcServices',function($scope, pcServices){
			var vm = this ; 
			var refs = pcServices.getCommonRefs();
			var userInfo = pcServices.getCookieObj('currentUser');
			var examinerInfo = pcServices.getCookieObj('examinerInfo');
			vm.certificationsList = pcServices.createFireArray(refs.accounts.child(examinerInfo.$id +"/certifications"));
			console.log(examinerInfo);
			vm.airportList = pcServices.createFireArray(refs.accounts.child(examinerInfo.$id +"/airports"));
			vm.bio = examinerInfo.data.bio ; 
			vm.examinerName = examinerInfo.data.name.first + " " +examinerInfo.data.name.last;
		}])

		.controller("examinerCalendarController",  ['$window','$scope', '$firebaseArray', '$firebaseObject', '$compile', 'uiCalendarConfig','pcServices',"calendarService",
			function ($window,$scope, $firebaseArray, $firebaseObject, $compile, uiCalendarConfig, pcServices, calendarService){
				var vm = this ;
				var refs= pcServices.getCommonRefs();
			  
		}])
		  

		.controller("studentHomePageController",  function($scope, $firebaseArray,$firebaseObject){
			var ref = new Firebase("https://checkride.firebaseio.com/");
			var authData = ref.getAuth();
			var studentRef = ref.child("users/" + authData.password.email.replace( /[\*\^\.\'\!\@\$]/g , ''));
			$scope.appointmentsList = $firebaseArray(studentRef.child("upcomingAppointments"));
		})




		/*
		////User.Services.js Ported below
		.factory("Auth", ["$firebaseAuth",
		  function($firebaseAuth) {
			var ref = new Firebase("https://checkride.firebaseio.com/users/");
			return $firebaseAuth(ref);
		  }
		])
		*/

		.service("profileService", ['$firebaseObject','$firebaseAuth', function($firebaseObject, $firebaseAuth){
				var examinerListRef = new Firebase("https://checkride.firebaseio.com/examiner");
			
			return{
				changePassword: function(ref,oldPassword, newPassword, email){
					if(oldPassword.length > 0 && newPassword.length > 0){
						ref.changePassword({
							  email: email,
							  oldPassword: oldPassword.toString(),
							  newPassword: newPassword.toString()
							},
						   function(error) {
							  if (error) {
								switch (error.code) {
								  case "INVALID_PASSWORD":
									console.log("The specified user account password is incorrect.");
									break;
								  case "INVALID_USER":
									console.log("The specified user account does not exist.");
									break;
								  default:
									console.log("Error changing password:", error);
								}
							  } else {
								console.log("User password changed successfully!");
							  }
						});
					}
				}
			}
	}])
})()
