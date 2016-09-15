angular.module('crAuth', ['firebase'])



////User.Services.js Ported below
.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://checkride.firebaseio.com/users/");
    return $firebaseAuth(ref);
  }
])



.controller("crAuthCtrl", ["loginService", "createAccountService","$scope", "$firebaseObject", "commonServices",function(loginService,createAccountService, $scope, $firebaseObject, commonServices){
    this.signIn = function(){
        loginService.signIn(this.email, this.password);
    }
    this.sendNewPassWord = function(){
        loginService.sendNewPassWord(this.email);
    }
    this.createAccountPage = function(){
        console.log(commonServices.getRoutePaths().signUp);
        commonServices.changePath(commonServices.getRoutePaths().signUp.path);
    }
    this.createAccount = function(){
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
}])

//CREATE ACCOUNT
.service('createAccountService',['commonServices',function(commonServices){
      var refs = commonServices.getCommonRefs();
      var createUserAccount = function(newUser, userId){ 
          refs.accounts.child(userId).set(newUser);
          console.log(refs.roles.child(newUser.userType.toLowerCase() + "/" + userId))
          refs.roles.child(newUser.userType.toLowerCase() + "/" + userId).set({name:newUser.firstName +" " + newUser.lastName});
      }
      
      return{
          createUser:function(newUser){
               refs.main.createUser({
                        email: newUser.emailAddress ,
                        password: newUser.password
                    }, function(error, userData){
                          if (error) {
                                console.log("Error creating user:", error);
                            } 
                            else {
                                createUserAccount(newUser, userData.uid);
                            }
                    });
            }
      }
}])
 
.service('loginService', ['commonServices', '$firebaseObject',function(commonServices,$firebaseObject){
    var usersRef = commonServices.getCommonRefs().accounts;
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
                        console.log(authData);
                        var userInfo = commonServices.createFireObj(usersRef.child(authData.uid));                 
                        userInfo.$loaded().then(function(){
                            console.log(userInfo);
                            commonServices.setCookieObj('currentUser', userInfo);
                            console.log(commonServices.getCookieObj('currentUser'));
                            commonServices.changePath(commonServices.getRoutePaths().profile.path);  
                        })
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
                          }else{
                            console.log("Password reset email sent successfully!");
                          }
                });
        }
    }
}])
