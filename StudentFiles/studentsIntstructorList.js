var myApp = angular.module("studentInstructorList", ['ui.calendar', 'firebase']);

myApp.controller("mainController",['$scope', '$firebaseArray','$window', function($scope, $firebaseArray, $window){
    
    var ref = new Firebase("https://checkride.firebaseio.com");
    var examinersListRef = new Firebase("https://checkride.firebaseio.com/examiner");
    $scope.instructorsList = $firebaseArray(examinersListRef);

    
    $scope.scheduleButton = function(index){
        ref.child("currentExaminer").set({
            id:angular.copy( $scope.instructorsList[index].userData.emailAddress.replace( /[\*\^\.\'\!\@\$]/g , ''))
        });
        console.log($scope);
        $window.location.href = "http://127.0.0.1:53693/instructorAvailability.html";
    

    };
        
    
}]);