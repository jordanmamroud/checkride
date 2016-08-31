
var app = angular.module("checkrideApp", ['firebase']);

app.service('loginService', function(){
    var usersRef  = new Firebase("https://checkride.firebaseio.com/users/");
    var auth = usersRef.getAuth();
    return{
        signIn: function(){
                console.log('hello');
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
                                          $window.location.href = "../examinerFiles/examinerCalendar.html"
                                        break;

                                    case "student":
                                          $window.location.href = "../StudentFiles/examinerList.html"
                                        break;
                                }
                            });
                    }
                }); 
        }
    }
});

app.controller("login", function($scope, $window, $firebaseObject){
    var usersRef  = new Firebase("https://checkride.firebaseio.com/users/");
    var auth = usersRef.getAuth();
    console.log('da');
    $scope.signIn = loginService.signIn();
        
//    $scope.createAccountButton = function(){ 
//        
//        $window.location.href = "createAccountPage.html";       
//    }
//    
    // when user clicks forgot password opens up the modal for them to enter their email and a new password will be sent
//    var forgotPassBtn = function(){
//        $("#passReset").on("click", function(){
//           $("#resetModal").addClass("showing"); 
//        });
//    }
//    forgotPassBtn();
    
    // when the user clicks send inside reset password modal this will send them a temporary password
    var sendNewPassword = function(ref){
        $("#sendButton").on("click", function(){
           ref.resetPassword({
                  email: $("#email").val()
                        }, 
                  function(error) {
                      if (error) {
                        switch (error.code) {
                          case "INVALID_USER":
                            alert("The account does not exist");
                            break;
                          default:
                            console.log("Error resetting password:", error);
                        }
                      } else {
                        console.log("Password reset email sent successfully!");
                      }
            });
        });
    }
    sendNewPassword(usersRef);
});




















//app.controller("login", function($scope, $window, $firebaseObject){
//        
//    var usersRef  = new Firebase("https://checkride.firebaseio.com/users/");
//    var auth = usersRef.getAuth();
//    $scope.signIn = function(){
//        usersRef.authWithPassword({
//            email: $scope.email ,
//            password: $scope.password
//        },
//        function(error, authData){
//            if(error){
//                alert("login failed");
//            } 
//            else{
//                       var user = usersRef.child(authData.password.email.replace( /[\*\^\.\'\!\@\$]/g , ''));
//                       var userInfo = $firebaseObject(user);
//                       userInfo.$loaded().then(function(){
//                            switch(userInfo.userData.userType.toLowerCase()){
//                                case "examiner":
//                                      $window.location.href = "../examinerFiles/examinerCalendar.html"
//                                      
////                                    $window.location.href ="https://checkride.firebaseapp.com/examinerFiles/examinerCalendar.html"
//                                    break;
//                                    
//                                case "student":
//                                      $window.location.href = "../StudentFiles/examinerList.html"
////                                    $window.location.href = "https://checkride.firebaseapp.com/StudentFiles/studentHomePage.html";
//                                    break;
//                            }
//                        });
//                }
//            }); 
//        }
//        
//    $scope.createAccountButton = function(){ 
//        $window.location.href = "createAccountPage.html";       
//    }
//    
//    // when user clicks forgot password opens up the modal for them to enter their email and a new password will be sent
//    var forgotPassBtn = function(){
//        $("#passReset").on("click", function(){
//           $("#resetModal").addClass("showing"); 
//        });
//    }
//    forgotPassBtn();
//    
//    // when the user clicks send inside reset password modal this will send them a temporary password
//    var sendNewPassword = function(ref){
//        $("#sendButton").on("click", function(){
//           ref.resetPassword({
//                  email: $("#email").val()
//                        }, 
//                  function(error) {
//                      if (error) {
//                        switch (error.code) {
//                          case "INVALID_USER":
//                            alert("The account does not exist");
//                            break;
//                          default:
//                            console.log("Error resetting password:", error);
//                        }
//                      } else {
//                        console.log("Password reset email sent successfully!");
//                      }
//            });
//        });
//    }
//    sendNewPassword(usersRef);
//});


