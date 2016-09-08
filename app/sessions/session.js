var crSession = angular.module('crSession', ['firebase', 'crSession.services'])



//Jordan
.controller("crLogin", ["loginService","$scope","$firebaseObject", "commonServices",function(loginService, $scope, $firebaseObject,commonServices){
    
   var usersRef  = new Firebase("https://checkride.firebaseio.com/users/");
    
   this.signIn = function(){
        loginService.signIn(this.email, this.password);
    }

    this.sendNewPassWord = function(){
        loginService.sendNewPassWord(this.email);
    }

   this.createAccountPage = function(){
        console.log('hammy');
        commonServices.changePath("/createAccount");
   }
}])


.controller('createUser',['$scope','createAccountService', function($scope, createAccountService){
    //CREATE USER - Jordan
    $scope.createAccount = function(){
        console.log("ham");
        var user = {
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            password:$scope.password,
            emailAddress:$scope.emailAddress,
            phone:$scope.phone,
            userType: $scope.userType
        }
        createAccountService.createUser(user);
    }


    //CREATE USER - Josh
//    $scope.create = function() {
//        $scope.message = null;
//        $scope.error = null;
//
//        Auth.$createUser({
//            email: $scope.email,
//            password: $scope.password
//        }).then(function(userData) {
//            $scope.message = "User created with uid: " + userData.uid;
//
//            console.log($scope.message);
//        }).catch(function(error) {
//            $scope.error = function(){
//                switch (error.code){
//                    case "AUTHENTICATION_DISABLED":
//                        return "The requested authentication provider is disabled for this Firebase application.";
//                    case "EMAIL_TAKEN":
//                        return "The new user account cannot be created because the specified email address is already in use.";
//                    case "INVALID_ARGUMENTS":
//                        return "The specified credentials are malformed or incomplete. Please refer to the error message, error details, and Firebase documentation for the required arguments for authenticating with this provider.";
//                    case "INVALID_CREDENTIALS":
//                        return "The specified authentication credentials are invalid. This may occur when credentials are malformed or expired.";
//                    case "INVALID_EMAIL":
//                        return "The specified email is not a valid email.";
//                    case "PROVIDER_ERROR":
//                        return "A third-party provider error occurred. Please refer to the error message and error details for more information.";
//                };
//                return "Aww, you done fucked up now.";
//            }();
//        });
//    };
}])
