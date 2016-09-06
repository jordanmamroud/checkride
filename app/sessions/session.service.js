var crSession = angular.module('crSession.services', ['firebase'])

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

.service('loginService', ["$firebaseObject", "$location",function($firebaseObject,$location){
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
                                         $location.path("/student")
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
}])






