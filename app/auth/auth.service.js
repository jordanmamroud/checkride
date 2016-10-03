(function(){
	angular.module('pcAuthService', ['firebase'])
		
		//Auth Service
		.factory("AuthService", AuthService )
        
        AuthService.$inject = ["$firebaseAuth", "$firebaseArray", "$q", "pcServices", "$localStorage"];
        
        function AuthService($firebaseAuth, $firebaseArray, $q, pcServices, $localStorage){
            
                var ref = pcServices.getCommonRefs();
                var auth = $firebaseAuth();
                var service = {
                    auth: auth,
                    //functions
                    createUser:createUser,
                    login: login,
                    logout: logout,
                    sendPasswordResetEmail: sendPasswordResetEmail,
                    User:User
                }    

                return service ;
                
                function createUser(newUser, password){
                        auth.$createUserWithEmailAndPassword(newUser.emailAddress, password)
                        .then(function(user){
                            createUserAccount(newUser, user.uid);
                        }).catch(function(error){
                            alert(error);
                        });
                    //inner function
                     function createUserAccount(newUser, userId){
                        ref.accounts.child(userId).set(newUser);
                        ref.roles.child(newUser.role.toLowerCase() + "/" + userId).set({name:newUser.name.first +" " + newUser.name.last});
                    }
                }

                function login(email, password){
                        auth.$signInWithEmailAndPassword(email, password).then(function(authData) {
                            var user = pcServices.createFireObj(ref.accounts.child(authData.uid));
                            $localStorage.$reset();
                                user.$loaded().then(function(){
                                    $localStorage.currentUser ={name:user.name, uid: user.$id}
                                    pcServices.changePath(pcServices.getRoutePaths().profile.path);
                                })
                            }).catch(function(error){
                            alert(error);
                        })
                }

                function logout(){
                    auth.$signOut().then(function(){
                        $localStorage.$reset();
                        pcServices.changePath("log-in");
                    }).catch(function(error){
                        alert(error);
                    })
                }
            
                function sendPasswordResetEmail(email){
                    auth.$sendPasswordResetEmail(email).then(function() {
                          console.log("Password reset email sent successfully!");
                    }).catch(function(error){
                          alert("Error: ", error);
                    });
                }
            
                function User(name, emailAddress, phone, role,photoUrl){
                        this.name = name;   
                        this.emailAddress= emailAddress;
                        this.phone=phone;
                        this.role= role;
                        this.photoUrl=photoUrl;
                }

                function updatePassword(newPassword){
                   auth.$updatePassword(newPassword).then(function() {
                          console.log("Password changed successfully!");
                    }).catch(function(error) {
                          console.error("Error: ", error);
                    });
                }  
        }
})()

