var app = angular.module('createAccountPage', ['firebase']);


app.service('createAccountService',[ function(){
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
}]);


app.controller('createAccountController',['$scope','createAccountService', function($scope, createAccountService){

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
    }]);  
   

    
   