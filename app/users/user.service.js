angular.module('crUserServices', ['firebase'])

.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://checkride.firebaseio.com/users/");
    return $firebaseAuth(ref);
  }
])

.service("profileService", ['$firebaseObject','$firebaseAuth', function($firebaseObject, $firebaseAuth){
        var examinerListRef = new Firebase("https://checkride.firebaseio.com/examiner");
    
    return{
        addCertification:function(ref,keycode, cert){
                 var certification = {
                    description: cert
                 }
                 if(keycode == 13){
                     ref.push(certification);
              
                 }
        },
        
        addAirport: function(ref, keycode, airport){
             var airportObj = {
                    name: airport
                 }
            if(keycode == 13){
                 ref.child(airportObj.name).set(airportObj);
            }
        },
        
        changePassword: function(ref,oldPassword, newPassword, email){
            if(oldPassword.length > 0 && newPassword.length > 0){
                ref.changePassword({
                      email: email,
                      oldPassword: oldPassword.toString(),
                      newPassword: newPassword.toString()
                    },
                   function(error) {
                      if (error) {
                        switch (error.code) {
                          case "INVALID_PASSWORD":
                            console.log("The specified user account password is incorrect.");
                            break;
                          case "INVALID_USER":
                            console.log("The specified user account does not exist.");
                            break;
                          default:
                            console.log("Error changing password:", error);
                        }
                      } else {
                        console.log("User password changed successfully!");
                      }
                });
            }
        },
        remove:function(ref, index){
             var arr = [];
             ref.once("value", function(datasnapshot){
               datasnapshot.forEach(function(childsnapshot){
                   arr.push(childsnapshot.key());
               });
                var itemToDelete = ref.child(arr[index]);
                itemToDelete.remove();
                console.log(arr[index]);
            });
        }
    }
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
}])