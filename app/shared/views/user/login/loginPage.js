
var app = angular.module("loginMod", ['firebase', 'commonServices']);


app.service('loginService', ["$firebaseObject", "$location",function($firebaseObject,$location){
    var usersRef  = new Firebase("https://checkride.firebaseio.com/users/");
    var auth = usersRef.getAuth();
    
    return{
        signIn: function(email, pass){
                usersRef.authWithPassword({
                    email: email,
                    password: pass
            },
            function(error, authData){
                if(error){
                    alert("login failed");
                } 
                else{
                           var user = usersRef.child(email.replace(/[\*\^\.\'\!\@\$]/g , ''));
                           var userInfo = $firebaseObject(user);
                           userInfo.$loaded().then(function(){
                                switch(userInfo.userData.userType.toLowerCase()){
                                    case "examiner":
                                          $location.path('/examiner/profile');
                                        break;
                                        
                                    case "student":
                                         $location.path("StudentFiles/examinerList.html")
                                        break;
                                }
                            });
                    }
                 
            })
        },
        
        sendNewPassWord: function(email){
               usersRef.resetPassword({
                      email: email
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
        }
    }
}]);

app.controller("LoginController", ["loginService","$scope","$firebaseObject", "commonServices",function(loginService, $scope, $firebaseObject,commonServices){
    
   var usersRef  = new Firebase("https://checkride.firebaseio.com/users/");
    
   this.signIn = function(){
        loginService.signIn(this.email, this.password);
    }

    this.sendNewPassWord = function(){
        loginService.sendNewPassWord(this.email);
    }

   this.createAccountPage = function(){
     commonServices.changePath("/createAccount");
   }
  
}]);




















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


