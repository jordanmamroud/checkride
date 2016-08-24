var instructorList = angular.module('instructorList',['firebase', 'studentDirectives']);

instructorList.controller('mainController',function($scope,$window, $firebaseArray){
    var ref = new Firebase("https://checkride.firebaseio.com/");
    var examinersRef = new Firebase("https://checkride.firebaseio.com/examiner");
    var authData = ref.getAuth();
    var studentRef = ref.child("student/" + authData.password.email.replace( /[\*\^\.\'\!\@\$]/g , ''));
    
    $scope.list = $firebaseArray(examinersRef);    
    
    // when the a student clicks schedule button it will go to the profile of the selected examiner
    var goToProfile = function(ref){
        $scope.scheduleButtonEvent = function(index){
            ref.child("currentExaminer").set($scope.list[index].userData.emailAddress.replace(/[\*\^\.\'\!\@\$]/g , ''));
    //        $window.location.href ="https://checkride.firebaseapp.com/StudentFiles/examinerAvailability.html";
              $window.location.href = "http://localhost:8000/Desktop/HTML%26CSS%26JSProjects/CheckRide/StudentFiles/viewProfileFiles/examinerInfo.html?username=" + 
                  $scope.list[index].userData.emailAddress.replace(/[\*\^\.\'\!\@\$]/g , '');
        }
    }
    goToProfile(studentRef);
});

