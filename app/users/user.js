angular.module("crUser",[])
//  var userType = commonServices.getCookieObj('currentUser').userData.userType.toLowerCase();
//    $scope.userType= '';
//    switch(userType){
//        case 'examiner' : 
//            $scope.userType ='examiner'
//            break;
//        case 'student' : 
//            $scope.userType = 'student' 
//            break ;
//    };

//Delete below
//'firebase', 'commonServices', 'crCalendar.service'


//Examiner Controllers
.controller("profileController", ['$scope','profileService', 'commonServices', function($scope, profileService,commonServices){
    var userInfo = commonServices.getCookieObj("currentUser").userData; 
    var userEmail = userInfo.emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '');
    var userRef =   commonServices.getCommonRefs().usersRef.child(userEmail);
    console.log('fans');
    $scope.oldPassword='';
    $scope.newPassword='';
    $scope.certificationsList = commonServices.createFireArray(userRef.child("/userData/certifications"));
    $scope.airportsList = commonServices.createFireArray(userRef.child("/userData/airports"));    
    $scope.name = userInfo.firstName + " " + userInfo.lastName;
    $scope.bio = userInfo.bio ;
    $scope.saveCertification = function(keycode){
        if(keycode===13){
             userRef.child("/userData/certifications").push({title:$scope.certification});
             $scope.certification = '';
        }
    }
    $scope.saveAirport = function(chip){
            userRef.child("/userData/airports").push({title:chip});
        return false ;
    }
    $scope.deleteAirport = function(chip){
        userRef.child("/userData/airports" + chip.$id).remove();
    }
    
    $scope.deleteCert = function(chip){
        console.log(index);
        userRef.child("/userData/certifications/" + chip.$id).remove()
    }
    $scope.saveChanges = function(){
//        userRef.child("userData/bio").set($scope.bio);
//        profileService.changePassword(userRef, $scope.oldPassword, $scope.newPassword, authData.password.email);
    } 
}])


// STUDENT CONTROLLERS
.controller('examinerAvailabilityController', ['$scope', function($scope){
    var userInfo = commonServices.getCookie("currentUser").userData;
    $scope.studentName = userInfo.firstName +" " + userInfo.lastName ;
 }])


.controller('examinerListController',["$scope","$location","$firebaseArray",function($scope,$location, $firebaseArray){
    var ref = new Firebase("https://checkride.firebaseio.com/");
    var examinersRef = new Firebase("https://checkride.firebaseio.com/examiner");
    var authData = ref.getAuth();
    var studentRef = ref.child("student/" + authData.password.email.replace( /[\*\^\.\'\!\@\$]/g , ''));
    $scope.list = $firebaseArray(examinersRef);  
    $scope.goToProfile = function(index){                   
    $location.path("/student/examinerProfile").search({username:$scope.list[index].userData.emailAddress.replace(/[\*\^\.\'\!\@\$]/g , '')});
    }    
}])



.controller('examinerInfoController', ['$scope', 'commonServices',function($scope, commonServices){
    var vm = this ; 
    var userInfo = commonServices.getCookieObj('currentUser').userData;
    vm.examinerId = commonServices.getRouteParams().username;
    vm.examinerListRef = "https://checkride.firebaseio.com/examiner" ;
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




////User.Services.js Ported below
.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://checkride.firebaseio.com/users/");
    return $firebaseAuth(ref);
  }
])

.service("profileService", ['$firebaseObject','$firebaseAuth', function($firebaseObject, $firebaseAuth){
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
        remove:function(ref, obj){
//             var arr = [];
//             ref.once("value", function(datasnapshot){
//               datasnapshot.forEach(function(childsnapshot){
//                   arr.push(childsnapshot.key());
//               });
//                var itemToDelete = ref.child(arr[index]);
//                itemToDelete.remove();
//                console.log(arr[index]);
            console.log(obj);
            }
        
    }
}])
