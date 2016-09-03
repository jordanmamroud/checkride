var crSession = angular.module('crSession', ['firebase'])


//LOGIN CONTROLLER
.controller("crLogin", ['$scope', 'Auth', 'RoutePaths', 'LoginService', function($scope, Auth, RoutePaths, LoginService){


    
    
}])

//Jordan
.controller("LoginController", ["loginService","$scope","$firebaseObject", "commonServices",function(loginService, $scope, $firebaseObject,commonServices){
    
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