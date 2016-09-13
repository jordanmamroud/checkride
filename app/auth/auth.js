angular.module('crAuth', ['firebase'])


////User.Services.js Ported below
.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://checkride.firebaseio.com/users/");
    return $firebaseAuth(ref);
  }
])


.controller("crAuthCtrl", ["loginService", "$scope", "$firebaseObject", "commonServices",function(loginService, $scope, $firebaseObject, commonServices){
    console.log('ham');
    console.log($scope)
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
.service('createAccountService',[function(){
      var ref  = new Firebase("https://checkride.firebaseio.com/"); 
      var onSuccess = function(newUser){ 
      ref.child("users/" + newUser.emailAddress.replace( /[\*\^\.\'\!\@\$]/g , '')).set({
                    userData:newUser
            });
            
            if(newUser.userType.toLowerCase() == "examiner" ){
                ref.child("examiner/" + newUser.emailAddress.replace( /[\*\^\.\'\!\@\$]/g , '')).set({userData:newUser}); 
            }
            
            if(newUser.userType.toLowerCase()== "student"){
                ref.child("student/"+newUser.emailAddress.replace( /[\*\^\.\'\!\@\$]/g , '')).set({userData: newUser});
            }
      }
      
      return{
          createUser:function(newUser){
               ref.createUser({
                        email: newUser.emailAddress ,
                        password: newUser.password
                    }, function(error, userData){
                          if (error) {
                                console.log("Error creating user:", error);
                            } 
                            else {
                                onSuccess(newUser);
                            }
                    });
            }
      }
}])
 
.service('loginService', ['$rootScope','commonServices', function($rootScope,commonServices){
    var usersRef =  commonServices.getCommonRefs().usersRef
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
                        var userInfo = commonServices.createFireObj(user.child('userData'));
                        $rootScope.loggedIn =true ;
                        userInfo.$loaded().then(function(){
                            commonServices.setCookieObj('currentUser', userInfo);
                            console.log(commonServices.getCookieObj('currentUser'));
                            commonServices.changePath(commonServices.getRoutePaths().profile.path);  
                            console.log(commonServices.createFireObj(user));
                            console.log(commonServices.getCookieObj('currentUser'));
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
                          } else {
                            console.log("Password reset email sent successfully!");
                          }
                });
        }
    }
}])
