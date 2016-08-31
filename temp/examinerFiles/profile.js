var app = angular.module("profile",['firebase', 'examinerDirectives']);



app.controller("profile", ['$scope',"$firebaseArray", "$firebaseObject", function($scope, $firebaseArray, $firebaseObject){
    var examinerListRef = new Firebase("https://checkride.firebaseio.com/examiner");
    var authData = examinerListRef.getAuth();
    var userEmail = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');
    var userRef = new Firebase("https://checkride.firebaseio.com/examiner/" + userEmail);
    var userInfo = $firebaseObject(userRef);
    var certificationsRef= new Firebase("https://checkride.firebaseio.com/examiner/" + userEmail +"/userData/certifications");
    var bioRef = new Firebase("https://checkride.firebaseio.com/examiner/" + userEmail +"/userData/bio");
    var airportsRef= new Firebase("https://checkride.firebaseio.com/examiner/" + userEmail +"/userData/airports");
    
    $scope.certificationsList = $firebaseArray(certificationsRef);
    $scope.airportsList = $firebaseArray(airportsRef);
    
    // setting the name to field
    var getName = function(fireObj){
        fireObj.$loaded().then(function(){
            $("#name").text(fireObj.userData.firstName +" " +fireObj.userData.lastName);
        });
    }
    getName(userInfo);
    
    
    
    // adds a new certification to the users certification list in firebase
    var addCertification = function(ref){
        $("#certifications").on("keypress", function(e){
            var certification = {
                description: $("input").val()
             }
             if(e.which == 13){
                ref.push(certification);
             }
        });
    }
    addCertification(certificationsRef);
    
    
    $("#airports").on("keypress",function(e){
        var airport = {
            name: $("#airports").val()
        }
        addAirport(e,airportsRef, airport);
    });
    // add airport to the list of airports that the examiner serves
    var addAirport = function(ref){
        $("#airports").on("keypress",function(e){
            if(e.which == 13){
                 var airport = {
                    name: $("#airports").val()
                 }
                 ref.child(airport.name).set(airport);
            };
        });
    }
    addAirport(airportsRef);
    
    // this function removes the item in the list that was selected to be deleted, it is used for the certifaction and airport lists
    var remove = function(ref, index){
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
    
    $scope.deleteAirport = function(index){
        remove(airportsRef, index);
    }
    
    $scope.deleteCert = function(index){
        remove(certificationsRef, index);
    }
    
    // make the bio text area editable
    var editBio = function(){
        $("#bio").on("click", function(){
            $("#bio").removeAttr("readonly");
        });
    };
    editBio();
    
    //saves the changes that were made to the bio and also updates password if user entered new one
    var saveChanges = function(){
    $("#save").on("click", function(){
            bioRef.set($("#bio").val());
            changePassword($("#oldPass").val(), $("#newPass"), userRef, authData.password.email);
        });
    }
    saveChanges();
    
    // this will change the password as long as the old password is right 
    var changePassword = function(oldPassword, newPassword, ref, userEmail){
        if(oldPassword.length > 0 && newPassword.length>0){
            ref.changePassword({
                  email: userEmail,
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
    }
}]);