var createAccountPage = angular.module('createAccountPage', ['firebase']);


createAccountPage.controller('createAccountController',function($scope, $firebase){

        var ref  = new Firebase("https://checkride.firebaseio.com/");
    
      // constructor for creating a new user
        var user = function(firstName, lastName, password, phone, emailAddress, userType){
            this.firstName= firstName ;
            this.lastName = lastName ;
            this.emailAddress = emailAddress
            this.password = password ;
            this.phone = phone ;
            this.userType = userType ;
        }
    
    // creates a new user account in firebase
        $scope.createAccount = function(){
            ref.createUser({
                email: $scope.emailAddress ,
                password: $scope.password
            }, function(error, userData){
                  if (error) {
                        console.log("Error creating user:", error);
                    } 
                    else {
                        onSuccess();
                    }
            });
        }
   
        
        //if user account is created this runs and it adds a new user to the user list in the db and to the specified user type list
        var onSuccess = function(){
            var firstName = angular.copy($scope.firstName);
            var lastName = angular.copy($scope.lastName) ;
            var password = angular.copy($scope.password);
            var emailAddress = angular.copy($scope.emailAddress);
            var phone = angular.copy($scope.phone);
            var userType = angular.copy($scope.userType);
            
            var userName = emailAddress.replace( /[\*\^\.\'\!\@\$]/g , ''));
            var newUser = new user(firstName, lastName,password,phone,emailAddress,userType);
            ref.child("users/" +userName.set({
                    userData: new user(firstName, lastName,password,phone,emailAddress,userType) 
                });
            if(userType.toLowerCase() == "examiner" ){
                ref.child("examiner/" + userName.set({userData:newUser}); 
            }
            
            if(userType.toLowerCase()== "student"){
                ref.child("student/" + userName.set({userData: newUser});
            }
        }      
    });  
   

    
   