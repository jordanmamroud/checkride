
angular.module("messages", []);


var Options = function(){
    var userListRef = new Firebase("https://checkride.firebaseio.com/users");
    var authData = userListRef.getAuth();
    var userId = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');
    var userRef = userListRef.child(userId);
    
    var methods = {
        "userListRef": userListRef,
        "authData": userListRef.getAuth(),
        "userId": userId ,
        "userRef": userRef,
    };
    
    
    
    return methods ;
}