var app = angular.module("examinerHomePage", ['firebase','examinerDirectives']);

app.controller("homePage", ["$scope", "$firebaseArray", function($scope, $firebaseArray){
    var ref = new Firebase("https://checkride.firebaseio.com/");
    var authData = ref.getAuth();
    var userEmail = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');
    var approvedApptsRef = new Firebase("https://checkride.firebaseio.com/users/" + userEmail + "/calendar/approvedAppointments");
    $scope.approvedApptsList = $firebaseArray(approvedApptsRef);

}]);