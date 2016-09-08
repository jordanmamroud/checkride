var crSession = angular.module('crSession.services', ['firebase', 'commonServices'])

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
 
.service('loginService', ['commonServices', function(commonServices){

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
                    var userInfo = commonServices.createFireObj(user);
                    userInfo.$loaded().then(function(){
                           commonServices.setCookieObj('currentUser', userInfo);  
                        
                            switch(userInfo.userData.userType.toLowerCase()){
                                case "examiner":
                                    commonServices.changePath("/examiner/calendar");
                                    break;

                                case "student":
                                    commonServices.changePath("/student");
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






