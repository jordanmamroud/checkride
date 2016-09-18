var app = angular.module('studentMod',['firebase', 'studentDirectives', 'pcServices', 'messages']);

app.controller('examinerListController',["$scope","$location","$firebaseArray",function($scope,$location, $firebaseArray){
    var ref = new Firebase("https://checkride.firebaseio.com/");
    var examinersRef = new Firebase("https://checkride.firebaseio.com/examiner");
    var authData = ref.getAuth();
    var studentRef = ref.child("student/" + authData.password.email.replace( /[\*\^\.\'\!\@\$]/g , ''));
    
    $scope.list = $firebaseArray(examinersRef);  
    $scope.goToProfile = function(index){   
        $location.path("/student/examinerProfile").search({username:$scope.list[index].userData.emailAddress.replace(/[\*\^\.\'\!\@\$]/g , '')});
    }
    
}]);

app.controller('examinerInfoController', ['$routeParams','$scope', '$firebaseArray','$firebaseObject', 'pcServices',function($routeParams,$scope, $firebaseArray, $firebaseObject){
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
    $scope.certificationsList.$loaded().then(function(){
            
    });
  
    examinerData.$loaded().then(function(){
        var data = examinerData.userData;
        $scope.bio = data.bio ;
        $scope.examinerName = data.firstName +" " + data.lastName ;

    });
    
}]);