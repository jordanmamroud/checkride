angular.module("crUser",[])

//Examiner Controllers
.controller("profileController", ['$scope','profileService', 'commonServices', function($scope, profileService,commonServices){
    var refs = commonServices.getCommonRefs();
    var userInfo = commonServices.getCookieObj("currentUser"); 
    var userRef =   commonServices.getCommonRefs().accounts.child(userInfo.$id);
    console.log(userRef.toString());
    $scope.userType = '';
    switch(userInfo.userType.toLowerCase()){
        case 'examiner' : 
            $scope.userType ='examiner'
            break;
        case 'student' : 
            $scope.userType = 'student' 
            break ;
    };
    $scope.certificationsList = commonServices.createFireArray(userRef.child("certifications"));
    $scope.airportsList = commonServices.createFireArray(userRef.child("airports"));
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
.controller('examinerAvailabilityController', ['$scope', 'commonServices',function($scope, commonServices){
    var userInfo = commonServices.getCookie("currentUser");
    $scope.studentName = userInfo.firstName +" " + userInfo.lastName ;
 }])


.controller('examinerListController',["$scope",'$location','commonServices',function($scope,$location,commonServices, $firebaseArray){
    var ref = new Firebase("https://checkride.firebaseio.com/");
    var examinersRef = new Firebase("https://checkride.firebaseio.com/examiner");
    var authData = ref.getAuth();
    var studentRef = ref.child("student/" + authData.password.email.replace( /[\*\^\.\'\!\@\$]/g , ''));
    $scope.list = commonServices.createFireArray(examinersRef);  
    $scope.goToProfile = function(index){ 
            
            $location.path(commonServices.getRoutePaths().examinerInfo.path).search({
                username: $scope.list[index].userData.emailAddress.replace(/[\*\^\.\'\!\@\$]/g , '')
            });
    }    
}])



.controller('examinerInfoController', ['$scope', 'commonServices',function($scope, commonServices){
    var vm = this ; 
    var userInfo = commonServices.getCookieObj('currentUser');
    vm.examinerId = commonServices.getRouteParams().username;
    var usersRef = commonServices.getCommonRefs().usersRef;
    var userRef = usersRef.child(userInfo.emailAddress.replace(/[\*\^\.\'\!\@\$]/g, ''));
    var examinerRef = usersRef.child(vm.examinerId);
    var examinerData = commonServices.createFireObj(examinerRef);
    vm.certificationsList = commonServices.createFireArray(examinerRef.child("userData/certifications"));
    vm.airportList = commonServices.createFireArray(examinerRef.child("userData/airports"));
    examinerData.$loaded().then(function(){
        var data = examinerData.userData;
        vm.bio = data.bio ;
        vm.examinerName = data.firstName +" " + data.lastName ;
    });
    vm.viewSchedule = function(){
       commonServices.changePath(commonServices.getRoutePaths().viewExaminerAvailability.path);
    }    
}])

.controller("examinerCalendarController",  ['$window','$scope', '$firebaseArray', '$firebaseObject', '$compile', 'uiCalendarConfig','commonServices',"calendarService",
      function ($window,$scope, $firebaseArray, $firebaseObject, $compile, uiCalendarConfig, commonServices, calendarService){
          var vm = this ;
          console.log('funions dope fudge');
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
