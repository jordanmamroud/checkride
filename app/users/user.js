(function(){

	angular.module("pcUser",[])

		//Shared Controllers

//		.controller("profileController", ['$rootScope','$scope','profileService', 'pcServices', 'currentUser',function($rootScope,$scope, profileService,pcServices, currentUser){
//			var refs = pcServices.getCommonRefs();
//			var userInfo = currentUser ;
//            var userRef = refs.accounts.child(userInfo.$id);
//            
//            $scope.currentUser = currentUser ;
		.controller("profileController", ['$scope','profileService', 'pcServices', 'user',function($scope, profileService,pcServices, user){
			var refs = pcServices.getCommonRefs();
			var userInfo = user ;
            var userRef = refs.accounts.child(userInfo.$id);
            
            $scope.certificationsList = pcServices.createFireArray(userRef.child("certifications"));
			$scope.airportsList = pcServices.createFireArray(userRef.child("airports"));
			$scope.saveCertification = saveCertification ;
			$scope.saveAirport= saveAirport ;
            $scope.deleteAirport = deleteAirport ;
            $scope.deleteCertification = deleteCertification ;
            console.log($scope);
            $scope.updateUser = function(ref){
                    if($scope.user.newPassword){
                        profileService.changePassword(refs.accounts.child($scope.user.$id), $scope.oldPassword, $scope.newPassword, $scope.user.emailAddress)
                    };
                $scope.user.$save();
            } 
            
            
            function saveCertification(chip){
                refs.certifications.child(chip + "/users/"+ userInfo.$id).set(true);
                saveChip(chip,"certifications");
            }
                        
            function saveAirport(chip){
               refs.airports.child(chip + "/users/"+ userInfo.$id).set(true);
               saveChip(chip, "airports");
            }
            
			function deleteAirport(chip){
				userRef.child("airports/" + chip.$id).remove();
                refs.airports.child(chip.$id + "/users/" + user.$id).remove();
			}
            
			function deleteCertification(chip){
				userRef.child("certifications/users/" + chip.$id).remove();
                refs.certifications.child(chip.$id + "/users/" + user.$id).remove();
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


		.controller('examinerListController',["$scope",'$location','pcServices',"$sessionStorage",function($scope,$location,pcServices,$sessionStorage){
			var vm = this ;
			var refs= pcServices.getCommonRefs();     
			vm.viewProfile  = viewProfile ;
			vm.examiners = pcServices.createFireArray(refs.examiners);

			function viewProfile(examiner){
				var examinerRef = refs.accounts.child(examiner.$id);
				examinerRef.once("value",function(data){
                    $sessionStorage.examiner = {$id:data.key(), data:data.val()}
					pcServices.changePath(pcServices.getRoutePaths().examinerInfo.path);
				});
			  }    
		}])

		.controller('examinerInfoController', ['$scope', 'pcServices','user',"$sessionStorage",function($scope, pcServices,user,$sessionStorage){
			var vm = this ; 
			var refs = pcServices.getCommonRefs();
			var userInfo = user ;
            
            vm.examinerInfo = $sessionStorage.examiner;
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
