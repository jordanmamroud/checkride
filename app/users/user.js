angular.module("crUser",['firebase', 'userDirectives', 'commonServices',  'crUserServices', 'crCalendar.service'])


//Examiner Controllers
.controller("profileController", ['$scope','profileService', 'commonServices',function($scope, profileService,commonServices){
    var userInfo = commonServices.getCookie("currentUser").userData; 
    var userEmail = userInfo.emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '');
    var userRef =   commonServices.getCommonRefs().usersRef.child(userEmail);
    var userInfo = commonServices.createFireObj(userRef);
    
    $scope.oldPassword='';
    $scope.newPassword='';
    $scope.certificationsList = commonServices.createFireArray(userRef.child("/userData/certifications"));
    $scope.airportsList = commonServices.createFireArray(userRef.child("/userData/airports"));    
    $scope.name = userInfo.firstName + " " + userInfo.lastName;
    $scope.bio = userInfo.bio ;
    
    
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
        userRef.child("userData/bio").set($scope.bio);
        profileService.changePassword(userRef, $scope.oldPassword, $scope.newPassword, authData.password.email);
    } 
}])


// STUDENT CONTROLLERS
.controller('examinerAvailabilityController', ['$scope', '$mdDialog','commonServices', 'calendarService', function ($scope, $mdDialog, commonServices, calendarService){
    
    $scope.examinerId = commonServices.getRouteParams().username;
    console.log($scope.examinerId);
    var userInfo = commonServices.getCookie("currentUser").userData;
    var loggedInStudentKey = userInfo.emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '');
    var examinerRef = commonServices.getCommonRefs().usersRef.child($scope.examinerId); 
    var examinerData = commonServices.createFireObj(examinerRef);
    var examinerCalendarRef = examinerRef.child("calendar");
    var eventsRef = examinerCalendarRef.child("events");
    var settingsRef = examinerCalendarRef.child("settings");
    var eventsList = commonServices.createFireArray(eventsRef);

    examinerData.$loaded().then(function(){
        $scope.examinerName = examinerData.userData.firstName + " " + examinerData.userData.lastName ;
    });
   
    $scope.sendRequest = function(){
        calendarService.sendAppointmentRequest(examinerRef, userInfo,$scope.eventStart, $scope.eventEnd);
    }
    
    $scope.eventSources = [];
    $scope.showApptDialog = function(){
        $mdDialog.show({
            scope:$scope.$new(),
            clickOutsideToClose:true,
            template:'<h2>Time</h2><br>'
            +'<p ng-model="eventStart">{{eventStart}}</p>'
            +'<p ng-model="eventEnd">{{eventEnd}}</p>'
            +'<md-button  class="md-raised md-primary" ng-click="sendRequest()">Request Appointment</md-button>'
        })
    }
        
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
                $scope.eventStart = start.toString();
                $scope.eventEnd = end.toString();
                $scope.showApptDialog();
                console.log('vain bane')
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



.controller('examinerInfoController', ['$routeParams','$scope', '$firebaseArray','$firebaseObject', 'commonServices',function($routeParams,$scope, $firebaseArray, $firebaseObject, commonServices){
    var vm = this ; 
    vm.examinerId = $routeParams.username ;
    vm.examinerListRef = "https://checkride.firebaseio.com/examiner" ;
    var usersRef = new Firebase("https://checkride.firebaseio.com/users");
    var authData = usersRef.getAuth();
    var userRef = usersRef.child(authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, ''));
    var examinerRef = usersRef.child(vm.examinerId);
    var certificationsRef = examinerRef.child("userData/certifications");
    var airportsRef = examinerRef.child("userData/airports");
    var studentData = commonServices.createFireObj(userRef);
    var examinerData = commonServices.createFireObj(examinerRef);
    
    vm.certificationsList = $firebaseArray(certificationsRef);
    vm.airportList = $firebaseArray(airportsRef);
    examinerData.$loaded().then(function(){
        var data = examinerData.userData;
        vm.bio = data.bio ;
        vm.examinerName = data.firstName +" " + data.lastName ;
    });
    vm.viewSchedule = function(){
       commonServices.changePath("/student/examinerAvailability");
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
});
