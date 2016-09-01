var app = angular.module("profile", ['firebase', 'examinerDirectives']);


app.service("profileService", ['$firebaseObject','$firebaseAuth', function($firebaseObject, $firebaseAuth){
        var examinerListRef = new Firebase("https://checkride.firebaseio.com/examiner");
    
    return{
        addCertification:function(ref,keycode, cert){
                 var certification = {
                    description: cert
                 }
                 if(keycode == 13){
                     ref.push(certification);
              
                 }
        },
        
        addAirport: function(ref, keycode, airport){
             var airportObj = {
                    name: airport
                 }
            if(keycode == 13){
                 ref.child(airportObj.name).set(airportObj);
            }
        },
        
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
        },
        remove:function(ref, index){
             var arr = [];
             ref.once("value", function(datasnapshot){
               datasnapshot.forEach(function(childsnapshot){
                   arr.push(childsnapshot.key());
               });
                var itemToDelete = ref.child(arr[index]);
                itemToDelete.remove();
                console.log(arr[index]);
            });
        }
    }
}]);


app.controller("profileController", ['$scope',"$firebaseArray", "$firebaseObject",'profileService', function($scope, $firebaseArray, $firebaseObject,profileService){

    var examinerListRef = new Firebase("https://checkride.firebaseio.com/examiner");
    var authData = examinerListRef.getAuth();
    var userEmail = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');
    var userRef = new Firebase("https://checkride.firebaseio.com/examiner/" + userEmail);
    var userInfo = $firebaseObject(userRef);
    var bioRef = new Firebase("https://checkride.firebaseio.com/examiner/" + userEmail +"/userData/bio");
    var certificationsRef= new Firebase("https://checkride.firebaseio.com/examiner/" + userEmail +"/userData/certifications");
    var airportsRef= new Firebase("https://checkride.firebaseio.com/examiner/" + userEmail +"/userData/airports");
    
    $scope.oldPassword='';
    $scope.newPassword='';
    
    $scope.certificationsList = $firebaseArray(certificationsRef);
    $scope.airportsList = $firebaseArray(airportsRef);
    
     userInfo.$loaded().then(function(){
        $scope.name = userInfo.userData.firstName + " " + userInfo.userData.lastName
        $scope.bio = userInfo.userData.bio ;
     });
    
    $scope.saveCertification = function(keycode){
        profileService.addCertification(certificationsRef,keycode, $scope.certification);
        if(keycode==13){
            $scope.certification = '';
        }
    }
    
    $scope.saveAirport = function(keycode){
        profileService.addAirport(airportsRef, keycode, $scope.airport);
        if(keycode==13){
            $scope.airport = '';
        }
    }

    $scope.deleteAirport = function(index){
        profileService.remove(airportsRef, index);
    }
    
    $scope.deleteCert = function(index){
        profileService.remove(certificationsRef, index);
    }
  
    $scope.saveChanges = function(){
        bioRef.set($scope.bio);
        profileService.changePassword(userRef, $scope.oldPassword, $scope.newPassword, authData.password.email);
    }
    
}]);