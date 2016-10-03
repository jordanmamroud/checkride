(function(){
    
angular.module('pcProfileService',[])	

    .service("profileService", ['$firebaseObject','$firebaseAuth','pcServices', profileService])

     function profileService($firebaseObject, $firebaseAuth,pcServices){
            var examinerListRef = pcServices.getCommonRefs().examiners;

            return{
                changePassword: changePassword
            }

            function changePassword(ref,oldPassword, newPassword, email){
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
                                        alert("Invalid Password: " + error)
                                        break;
                                    case "INVALID_USER":
                                        alert("The specified user account does not exist.");
                                        break;
                                    default:
                                        alert("Error changing password:", error);
                                    }
                                } else {
                                console.log("User password changed successfully!");
                          }
                    });
                }
            }
    }
}());