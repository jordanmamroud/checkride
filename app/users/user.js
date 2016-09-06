angular.module("crUser",['firebase', 'userDirectives', 'commonServices',  'crUserServices'])


//Examiner Controllers
.controller("profileController", ['$scope',"$firebaseArray", "$firebaseObject",'profileService', function($scope, $firebaseArray, $firebaseObject,profileService){
    
    var usersRef = new Firebase("https://checkride.firebaseio.com/users");
    var authData = usersRef.getAuth();
    var userEmail = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');
    var userRef =   usersRef.child(userEmail);
    var bioRef = userRef.child("userData/bio");
    var certificationsRef= userRef.child("/userData/certifications");
    var airportsRef= userRef.child("/userData/airports");
    var userInfo = $firebaseObject(userRef);
    
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
    
}])


// STUDENT CONTROLLERS
.controller('examinerAvailabilityController', ['$scope', "$firebaseObject", '$firebaseArray', '$compile', 'uiCalendarConfig',"$routeParams", '$location', function ($scope, $firebaseObject, $firebaseArray, $compile, uiCalendarConfig,$routeParams, $location) {
    
    $scope.examinerId = $routeParams.username ; 
    var usersRef = new Firebase("https://checkride.firebaseio.com/users");
    var authData = usersRef.getAuth();
    var loggedInStudent = usersRef.child(authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, ''));
    var examinerRef = usersRef.child($scope.examinerId ); 
    var examinerData = $firebaseObject(examinerRef);
    var examinerCalendarRef = examinerRef.child("calendar");
    var eventsref = examinerCalendarRef.child("events");
    var appointmentsRef = examinerCalendarRef.child("approvedAppointments");
    var settingsRef = examinerCalendarRef.child("settings");
    var eventsList = $firebaseArray(eventsref);
    var approvedAppointmentsList = $firebaseArray(appointmentsRef);
    var studentData = $firebaseObject(loggedInStudent);
    
    
    $scope.goBack = function(){
         $location.path("/student/examinerProfile");
    }
    
    studentData.$loaded().then(function(){
        $scope.studentName = studentData.userData.firstName + " " + studentData.userData.lastName ;
    })
   
    $scope.sendRequest = function(){
        var data = studentData.userData ;
        var examinerRequestListRef = examinerRef.child("appointmentRequests/" + studentData.userData.emailAddress.replace(/[\*\^\.\'\!\@\$]/g, ''));
        examinerRequestListRef.set({
            firstName: data.firstName,
            lastName: data.lastName,
            emailAddress: data.emailAddress,
            sentAt: new Date(Date.now()).toString(),
            requestedStartTime: $scope.eventStart,
            requestedEndTime: $scope.eventEnd,
        });
    }
        $scope.eventSources = [];
    
        $scope.uiConfig = {
            calendar: {
//                googleCalendarApiKey: 'AIzaSyA0IwuIvriovVNGQiaN-q2pKYIpkWqSg0c',

                events: eventsList,
                height: '100%',
                timezone: "local",
                editable: true,
                defaultView: 'agendaWeek',
                header: {
                    left: 'month agendaWeek  agendaDay ',
                    center: 'title',
                    right: 'today prev,next settingsButton'
                },
                selectable: true,
                selectable: {
                    month: true,
                    agenda: true
                },
                unselectAuto: true,
                select: function (start, end, ev) {
                    $("#requestModal").addClass("showing");
                    $scope.eventStart = start.toString();
                    $scope.eventEnd = end.toString();
                },
                editable: false,
                eventClick: function (event, element) {
                    // stops gcal events from going to google calendar
                      if (event.url) {
                          alert("sorry this time is not available");
                            return false;
                    }
                    alert("sorry this time is not available");
                }
            }
        }; 
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

.controller('examinerInfoController', ['$routeParams','$scope', '$firebaseArray','$firebaseObject', 'commonServices', "$location",function($routeParams,$scope, $firebaseArray, $firebaseObject,commonServices,$location){
    $scope.examinerId = $routeParams.username ;
    var usersRef = new Firebase("https://checkride.firebaseio.com/users");
    var authData = usersRef.getAuth();
    var userRef = usersRef.child(authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, ''));
    var examinerRef = usersRef.child($scope.examinerId)
    var certificationsRef = examinerRef.child("userData/certifications");
    var airportsRef = examinerRef.child("userData/airports");
    var bioRef = examinerRef.child("userData/bio");
    var studentData = $firebaseObject(userRef);
    var examinerData = $firebaseObject(examinerRef);
    $scope.certificationsList = $firebaseArray(certificationsRef);
    $scope.airportList = $firebaseArray(airportsRef);
    
    examinerData.$loaded().then(function(){
        var data = examinerData.userData;
        $scope.bio = data.bio ;
        $scope.examinerName = data.firstName +" " + data.lastName ;
    });
    
    $scope.viewSchedule = function(){
        $location.path("/student/examinerAvailability");
    }    
}])

.controller('examinerInfoController', ['$routeParams','$scope', '$firebaseArray','$firebaseObject', 'commonServices', "$location",function($routeParams,$scope, $firebaseArray, $firebaseObject,commonServices,$location){
    $scope.examinerId = $routeParams.username ;
    var usersRef = new Firebase("https://checkride.firebaseio.com/users");
    var authData = usersRef.getAuth();
    var userRef = usersRef.child(authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, ''));
    var examinerRef = usersRef.child($scope.examinerId)
    var certificationsRef = examinerRef.child("userData/certifications");
    var airportsRef = examinerRef.child("userData/airports");
    var bioRef = examinerRef.child("userData/bio");
    var studentData = $firebaseObject(userRef);
    var examinerData = $firebaseObject(examinerRef);
    $scope.certificationsList = $firebaseArray(certificationsRef);
    $scope.airportList = $firebaseArray(airportsRef);
    
    examinerData.$loaded().then(function(){
        var data = examinerData.userData;
        $scope.bio = data.bio ;
        $scope.examinerName = data.firstName +" " + data.lastName ;
    });
    
    $scope.viewSchedule = function(){
        $location.path("/student/examinerAvailability");
    }    
}])

.controller("studentHomePageController",  function($scope, $firebaseArray,$firebaseObject){
    var ref = new Firebase("https://checkride.firebaseio.com/");
    var authData = ref.getAuth();
    var studentRef = ref.child("users/" + authData.password.email.replace( /[\*\^\.\'\!\@\$]/g , ''));
    $scope.appointmentsList = $firebaseArray(studentRef.child("upcomingAppointments"));
});
