(function(){

	angular.module("pcUser",[])

		//Shared Controllers
<<<<<<< HEAD
		.controller("profileController", ['$rootScope','$scope','profileService', 'pcServices', 'currentUser',function($rootScope,$scope, profileService,pcServices, currentUser){
			var refs = pcServices.getCommonRefs();
			var userInfo = currentUser ;
            var userRef = refs.accounts.child(userInfo.$id);
            
            $scope.currentUser = currentUser ;
=======
		.controller("profileController", ['$scope','profileService', 'pcServices', 'user',function($scope, profileService,pcServices, user){
			var refs = pcServices.getCommonRefs();
			var userInfo = user;
            var userRef = refs.accounts.child(userInfo.$id);
            console.log("urry",user);
            $scope.user = user ;
>>>>>>> c14467f705ed978789fef30f4c64ee6b32ebcf33
            $scope.certificationsList = pcServices.createFireArray(userRef.child("certifications"));
			$scope.airportsList = pcServices.createFireArray(userRef.child("airports"));
			$scope.saveCertification = saveCertification ;
			$scope.saveAirport= saveAirport ;
            $scope.deleteAirport = deleteAirport ;
            $scope.deleteCertication = deleteCertication ;
                        
            function saveCertification(chip){
               saveChip(chip,"certifications");
            }
                        
            function saveAirport(chip){
               saveChip(chip, "airports");
            }
            
			function deleteAirport(chip){
				userRef.child("airports/" + chip.$id).remove();
			}
            
			function deleteCertication(chip){
				userRef.child("certifications/" + chip.$id).remove();
			}
            
           function saveChip(chip, type){
                if(chip.hasOwnProperty("$id") == false){
					  userRef.child( type+ "/" + chip).set(true);
				      userRef.child(type + "/" + chip).set(true);
					  return null ;
				}
            }
		}])

		// STUDENT CONTROLLERS
		.controller('examinerAvailabilityController', ['$scope', 'pcServices', 'user',function($scope, pcServices,user){
			var userInfo = user ;
			$scope.studentName = userInfo.name.first +" " + userInfo.name.last ;
		 }])


		.controller('examinerListController',["$scope",'$location','pcServices',function($scope,$location,pcServices){
			var vm = this ;
			var refs= pcServices.getCommonRefs();     
			vm.viewProfile  = viewProfile ;
			vm.examiners = pcServices.createFireArray(refs.examiners);

			function viewProfile(examiner){
				pcServices.removeCookieObj("examinerInfo");
				var examinerRef = refs.accounts.child(examiner.$id);
				examinerRef.once("value",function(data){
					pcServices.setCookieObj("examinerInfo", {$id:data.key(),data:data.val()});
					console.log(pcServices.getCookieObj('examinerInfo'));
					pcServices.changePath(pcServices.getRoutePaths().examinerInfo.path);
				});
			  }    
		}])

		.controller('examinerInfoController', ['$scope', 'pcServices','user',function($scope, pcServices,user){
			var vm = this ; 
			var refs = pcServices.getCommonRefs();
			var userInfo = user ;
            
            vm.examinerInfo = pcServices.getCookieObj('examinerInfo');
			vm.certificationsList = pcServices.createFireArray(refs.accounts.child(vm.examinerInfo.$id +"/certifications"));
			vm.airportList = pcServices.createFireArray(refs.accounts.child(vm.examinerInfo.$id +"/airports"));
		}])

		.controller("examinerCalendarController",  ['$window','$scope', '$firebaseArray', '$firebaseObject', '$compile', 'uiCalendarConfig','pcServices',"calendarService",
			function ($window,$scope, $firebaseArray, $firebaseObject, $compile, uiCalendarConfig, pcServices, calendarService){
				var vm = this ;
				var refs= pcServices.getCommonRefs();  
		}])
		  

		.controller("studentHomePageController",  function($scope, $firebaseArray,$firebaseObject){

		})

		.service("profileService", ['$firebaseObject','$firebaseAuth', function($firebaseObject, $firebaseAuth){
				var examinerListRef = new Firebase("https://checkride.firebaseio.com/examiner");
			
			return{
				changePassword: changePassword
            }
            
            function changePassword(ref,oldPassword, newPassword, email){
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
										alert("Invalid Password: " + error)
										break;
									case "INVALID_USER":
										alert("The specified user account does not exist.");
										break;
									default:
										alert("Error changing password:", error);
									}
								} else {
								console.log("User password changed successfully!");
						  }
					});
				}
            }
	}])
})()
