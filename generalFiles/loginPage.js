
var loginPage = angular.module("loginPage", ['firebase']);

loginPage.controller("mainController",function($scope, $window, $firebaseObject){
    
    var usersRef  = new Firebase("https://checkride.firebaseio.com/users/");
    $scope.signIn = function(){
        usersRef.authWithPassword({
            email: $scope.email ,
            password: $scope.password
        },
    
        function(error, authData){
            if(error){
                alert("login failed");
            } 
            else{
                       var user = usersRef.child(authData.password.email.replace( /[\*\^\.\'\!\@\$]/g , ''));
                       var userInfo = $firebaseObject(user);
                        userInfo.$loaded().then(function(){
                            switch(userInfo.userData.userType.toLowerCase()){
                                case "examiner":
                                    $window.location.href ="http://localhost:8000/Desktop/HTML%26CSS%26JSProjects/CheckRide/examinerFiles/examinerCalendar.html"
                                    break;
                                    
                                case "student":
                                    $window.location.href = "http://127.0.0.1:59651/StudentFiles/studentHomePage.html";
                                    break;
                            }
                        });
                }
            }); 
        }
        
    $scope.createAccountButton = function(){ 
        $window.location.href = "http://127.0.0.1:61752/createAccountPage.html";       
    }
});