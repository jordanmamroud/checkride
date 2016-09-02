var myApp = angular.module('examinerInfoMod', ['firebase', 'studentDirectives']);

myApp.controller('examinerInfoController', ['$scope', '$firebaseArray','$firebaseObject' ,function($scope, $firebaseArray, $firebaseObject){
    

    var examinerId = methods.getVarFromURL();
    
    var studentsRef = new Firebase("https://checkride.firebaseio.com/student/");
    var authData = studentsRef.getAuth();
    var userRef = studentsRef.child(authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, ''));
    var userDataRef = userRef.child('userData');
    var studentData = $firebaseObject(userDataRef);
    var userListExaminerRef = new Firebase("https://checkride.firebaseio.com/users/" + examinerId);
    var examinerRef = new Firebase("https://checkride.firebaseio.com/examiner/" + examinerId); 
    var examinerDataRef = examinerRef.child('userData')
    var certificationsRef = examinerDataRef.child("certifications");
    var airportsRef = examinerDataRef.child("airports");
  
    $scope.certificationsList = $firebaseArray(certificationsRef);
    $scope.airportList = $firebaseArray(airportsRef);
    $scope.certificationsList.$loaded().then(function(){
            console.log($scope.certificationsList);
    })
  
    
    
    var callFunctions = function(){
        getBio(examinerRef);
        setExaminerName(examinerDataRef);
        viewExaminerSchedule();
        setUpMessaging();
    }
    
    var setUpMessaging = function(){
        methods.showModalOnClick("#messageButton", "#messageModal");
        studentData.$loaded().then(function(){
            var sender = studentData.firstName + " " + studentData.lastName ;
            console.log(sender);
            methods.sendMessageOnClick("#sendButton", userListExaminerRef, sender);
        });
        methods.sendTextOnClick("#sendButton", {
            name:"guess who it is",
            phoneNumber: '7325704291'
        });
    }
    
 
    var getBio = function(ref){
        console.log(ref.toString());
        ref.on("value", function(datasnapshot){
            console.log(datasnapshot.val());
            $("#bio").text(datasnapshot.val().userData.bio);
        });
    }
    
    var setExaminerName = function(ref){
        ref.once("value", function(datasnapshot){
             $("#examinerName").text(datasnapshot.val().firstName + " " + datasnapshot.val().lastName); 
        });
    }
    
   var viewExaminerSchedule = function(){
      methods.newWindowOnClick("#scheduleButton", "../StudentFiles/viewProfileFiles/examinerAvailability.html?username=" + examinerId);
   }
   
   callFunctions();
    
}]);