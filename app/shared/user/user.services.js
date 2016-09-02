angular.module('UserServices.Module', ['firebase'])

.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://checkride.firebaseio.com/users/");
    return $firebaseAuth(ref);
  }
])




.service('LoginService', ["$location", 'RoutePaths', function($firebaseAuth, $firebaseObject,$location, RoutePaths){
    

/*
   var usersRef  = new Firebase("https://checkride.firebaseio.com/users/");
    var auth = usersRef.getAuth();
    
    
    
    return{
        signUp: RoutePaths.signUp,
        signIn: function(email, pass, fireData){

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
    }*/
}])




//LOGIN CONTROLLER
.controller("UserServices", ['$scope', 'Auth', 'RoutePaths', 'LoginService', function($scope, Auth, RoutePaths, LoginService){

    console.log(Auth);
    this.signUp = RoutePaths.signUp;
    
    
    //CREATE ACCOUNT
    $scope.create = function() {
        $scope.message = null;
        $scope.error = null;

        Auth.$createUser({
            email: $scope.email,
            password: $scope.password
        }).then(function(userData) {
            $scope.message = "User created with uid: " + userData.uid;
            
            console.log($scope.message);
        }).catch(function(error) {
            $scope.error = function(){
                switch (error.code){
                    case "AUTHENTICATION_DISABLED":
                        return "The requested authentication provider is disabled for this Firebase application.";
                    case "EMAIL_TAKEN":
                        return "The new user account cannot be created because the specified email address is already in use.";
                    case "INVALID_ARGUMENTS":
                        return "The specified credentials are malformed or incomplete. Please refer to the error message, error details, and Firebase documentation for the required arguments for authenticating with this provider.";
                    case "INVALID_CREDENTIALS":
                        return "The specified authentication credentials are invalid. This may occur when credentials are malformed or expired.";
                    case "INVALID_EMAIL":
                        return "The specified email is not a valid email.";
                    case "PROVIDER_ERROR":
                        return "A third-party provider error occurred. Please refer to the error message and error details for more information.";
                };
                return "Aww, you done fucked up now.";
            }();
        });
    };
    
    
}])








//COMMON SERVICES
.service("CommonServices", ["$location",'$timeout', function($location, $timeout){
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