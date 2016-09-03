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