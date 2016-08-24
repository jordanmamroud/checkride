var app = angular.module("studentHomePage", ['firebase', 'studentDirectives']);

app.controller("mainController",  function($scope, $firebaseArray,$firebaseObject){
    var ref = new Firebase("https://checkride.firebaseio.com/");
    var authData = ref.getAuth();
    var studentRef = ref.child("users/" + authData.password.email.replace( /[\*\^\.\'\!\@\$]/g , ''));
    $scope.appointmentsList = $firebaseArray(studentRef.child("upcomingAppointments"));
    

});


//var instructorList = angular.module('instructorList',['firebase']);
//
//instructorList.controller('mainController',function($scope,$window, $firebaseArray){
//    var ref = new Firebase("https://checkride.firebaseio.com/");
//    var examinersRef = new Firebase("https://checkride.firebaseio.com/examiner");
//    var authData = ref.getAuth();
//    var studentRef = ref.child("student/" + authData.password.email.replace( /[\*\^\.\'\!\@\$]/g , ''));
//    
//    
//    $scope.list = $firebaseArray(examinersRef);    
//    $scope.scheduleButtonEvent = function(index){
//        studentRef.child("currentExaminer").set($scope.list[index].userData.emailAddress.replace(/[\*\^\.\'\!\@\$]/g , ''));
//        $window.location.href ="http://127.0.0.1:49224/StudentFiles/examinerAvailability.html";
//    }
//});

