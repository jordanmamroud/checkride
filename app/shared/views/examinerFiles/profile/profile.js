var app = angular.module("profile", ['firebase', 'examinerDirectives']);


app.service("profileService", ['$firebaseObject','$firebaseAuth', function($firebaseObject, $firebaseAuth){
        var examinerListRef = new Firebase("https://checkride.firebaseio.com/examiner");
//        var authData = examinerListRef.getAuth();
//        
//        var userEmail = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');
        var userRef = new Firebase("https://checkride.firebaseio.com/examiner/" + userEmail);
        var userInfo = $firebaseObject(userRef);
        var certificationsRef= new Firebase("https://checkride.firebaseio.com/examiner/" + userEmail +"/userData/certifications");
        var bioRef = new Firebase("https://checkride.firebaseio.com/examiner/" + userEmail +"/userData/bio");
        var airportsRef= new Firebase("https://checkride.firebaseio.com/examiner/" + userEmail +"/userData/airports"); 
        
    
    return{
       
        addCertification:function(keycode, cert){
                 var certification = {
                    description: cert
                 }
                 if(keycode == 13){
                     certificationsRef.push(certification);

                 }
        },
        
        addAirport: function(keycode, airport){
            if(keycode == 13){
                 var airportObj = {
                    name: airport
                 }
                 airportsRef.child(airport.name).set(airportObj);
            };
        },
        setNameField:function(){
            userInfo.$loaded().then(function(){
                console.log('ham')
                var name = userInfo.userData.firstName + " " + userInfo.userData.lastName
                console.log(name);
                return name ;
            });
        },
        
        changePassword: function(oldPassword, newPassword, email){
            if(oldPassword.length > 0 && newPassword.length>0){
                userRef.changePassword({
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
    
//    console.log(profileService.userEmail);
     userInfo.$loaded().then(function(){
        $scope.name = userInfo.userData.firstName + " " + userInfo.userData.lastName
    });
    
    $scope.certificationsList = $firebaseArray(certificationsRef);
    $scope.airportsList = $firebaseArray(airportsRef);

    $scope.saveCertification = function(e){
        profileService.addCertification(e, $scope.certification)
        $scope.certification = '';
    }


    $scope.saveAirport = function(keycode){
        profileService.addAirport(keycode, $scope.airport);
        $scope.airport = '' ;
    }

    $scope.deleteAirport = function(index){
        profileService.remove(airportsRef, index);
    }
    
    $scope.deleteCert = function(index){
        remove(certificationsRef, index);
    }
  
    $scope.saveChanges = function(){
        bioRef.set($scope.bio);
        profileService.changePassword($scope.oldPassword, $scope.newPassword, authData.password.email);
    }
    
 
}]);