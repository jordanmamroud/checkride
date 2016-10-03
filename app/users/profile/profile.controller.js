angular.module('pcProfileController',[])		

   

    .controller("profileController", profileController); 

     profileController.$inject = ['$scope','profileService', 'pcServices','$localStorage'];

        function profileController($scope, profileService,pcServices,$localStorage){

            var refs = pcServices.getCommonRefs();
            var userInfo = $localStorage.currentUser;  
            var userId = userInfo.uid;
            var userRef = refs.accounts.child(userInfo.uid);
            
            $scope.stripeCallback = function (code, result){
                if (result.error) {
                    alert('it failed! error: ' + result.error.message);
                } else {
                    console.log(code,result);
                    alert('success! token: ' + result.id);
                }
            };
            
            $scope.user = pcServices.createFireObj(userRef);
            $scope.certificationsList = pcServices.createFireArray(userRef.child("certifications"));
            $scope.airportsList = pcServices.createFireArray(userRef.child("airports"));
            $scope.saveCertification = saveCertification ;
            $scope.saveAirport= saveAirport ;
            $scope.deleteAirport = deleteAirport ;
            $scope.deleteCertification = deleteCertification ;
            $scope.airportOptions = pcServices.createFireArray(refs.airports.child("detail"));
                
            $scope.updateUser = function(ref){
                    if($scope.user.newPassword){
                        profileService.changePassword(refs.accounts.child(userInfo.uid), $scope.oldPassword, $scope.newPassword, $scope.user.emailAddress)
                    };
                $scope.user.$save();
            } 
            
            function saveCertification(chip){
                refs.certifications.child(chip + "/users/"+ userInfo.uid).set(true);
                saveChip(chip,"certifications");
            }

            function saveAirport(val){
               console.log(val);
               refs.airports.child("examiners/" +val+ "/" + userInfo.uid).set({
                   name:{first: userInfo.name.first , last:userInfo.name.last},
                   photoUrl:"https://firebasestorage.googleapis.com/v0/b/project-1750560572472647029.appspot.com/o/default-avitar.jpg?alt=media&token=e3c47907-735b-40bc-8954-164ba387c944" 
               });
              userRef.child('airports/'+val).set(true);                
            }

            function deleteAirport(chip){
                userRef.child("airports/" + chip.$id).remove();
                refs.airports.child("examiners/"+ chip.$id + "/" +userId).remove();
            }

            function deleteCertification(chip){
                userRef.child("certifications/users/" + chip.$id).remove();
                refs.certifications.child(chip.$id + "/users/" +userId).remove();
            }

           function saveChip(chip, type){
                if(chip.hasOwnProperty("$id") == false){
                      userRef.child( type+ "/" + chip).set(true);
                      userRef.child(type + "/" + chip).set(true);
                      return null ;
                }
            }
    }