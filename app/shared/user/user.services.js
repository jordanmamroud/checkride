angular.module('UserServices.Module', []);

checkrider.service('LoginService', ["$firebaseObject", "$location", 'RoutePaths', function($firebaseObject,$location, RoutePaths){
    
    var usersRef  = new Firebase("https://checkride.firebaseio.com/users/");
    var auth = usersRef.getAuth();
    
    return{
        signIn: function(email, pass, fireData){
                console.log('bane');
                usersRef.authWithPassword({
                email: email ,
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
                                          $location.path('/examiner');
                                        
                                        break;

                                    case "student":
                                         $location.path("StudentFiles/examinerList.html")
                                        break;
                                }
                            });
                    }
                }); 
        },
        
        sendNewPassWord: function(){
               usersRef.resetPassword({
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
        }
    }
}])

.controller("LoginController", ['LoginService',function($scope, $window, $firebaseObject, LoginService){
    var usersRef  = new Firebase("https://checkride.firebaseio.com/users/");
    var auth = usersRef.getAuth();

    $scope.signIn = LoginService.signIn();
    
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
}]);






checkrider.service("CommonServices", ["$location",'$timeout', function($location, $timeout){
    return{
        
        changeLocationOnClick: function(selector, urlString){
            $(selector).on("click",function(){
                 $timeout(function(){
                     $location.path("/createAccount")
                },1);
            });
        },
        
        orderArray: function(list, orderBy){
            list = $filter('orderBy')(list, orderBy);
        },
        
        showToastOnEvent: function(ref,child,event){
            ref.child(child).on(event, function (datasnapshot){
                                $('.toast').fadeIn(400).delay(3000).fadeOut(400);
            });
        },
        
        setDataField: function(fireData, selector){
            fireData.$loaded().then(function(){
               $(selector).text(fireData.userData.firstName + " " + fireData.userData.lastName); 
            });
        }
        
    }
}]);