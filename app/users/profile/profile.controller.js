angular.module('pcProfileController',[])		

   

    .controller("profileController", profileController); 

     profileController.$inject = ['$scope','profileService', 'pcServices','$localStorage','$http','$timeout','searchService'];

    function profileController($scope, profileService, pcServices, $localStorage, $http, $timeout, searchService){
        
        var self = this ;
        var refs = pcServices.getCommonRefs();
        var userInfo = $localStorage.currentUser;  
        var userId = userInfo.uid;
        var userRef = refs.accounts.child(userInfo.uid);
                    
        $scope.user = pcServices.createFireObj(userRef);
        $scope.certificationsList = pcServices.createFireArray(userRef.child("certifications"));
        $scope.airportsList = pcServices.createFireArray(userRef.child("airports"));
        $scope.saveCertification = saveCertification ;
        $scope.saveAirport= saveAirport ;
        $scope.deleteAirport = deleteAirport ;
        $scope.deleteCertification = deleteCertification ;
        $scope.airportOptions ='' ;
        
        $scope.user.address={address:'', city:'', state:'', zipcode:''};
        $scope.certification = {class:'', rating:'',category:''};
        $scope.categories = {title:'airplane', list:["airplane","rotocraft", "Lighter_Than_Air", "Power_lift"]};
        $scope.ratings = {title:'ratings', list:['sport', 'recreational', 'private', 'commercial', 'flight instructor', 'Airline Transport Pilot']};
        $scope.classes = {title:'classes', list:['single-engine','multiengine','land','water', 'gyroplane','helicopter','airship','free ballon']}; 
        $scope.saveCertification=  saveCertification
        $scope.mainAirport=  mainAirport;
      
        $scope.updateUser = updateUser;
        $scope.querySearch= querySearch;

        function deleteAirport(chip){
            userRef.child("airports/" + chip.$id).remove();
            refs.airports.child("examiners/"+ chip.$id + "/" +userId).remove();
        }
// ask josh how certs should be displayed
        function deleteCertification(chip){
            userRef.child("certifications/" + chip.$id).remove();
            console.log(chip.$id);
            refs.certifications.child(chip.$id + "/" + userId).remove();
        }
        
        function mainAirport(arpt){
            delete arpt.$$hashKey ;
            refs.user.child('mainAirport').set(arpt);
        }
        
        function querySearch (query) {
            
            searchService.getMatchingAirports(query, function(response){
                 $scope.airportOptions= response.airports
                 console.log(response)
            });

            var results = query ? $scope.airportOptions : $scope.airportOptions, deferred ; 
            return results ;
        }
        
        function saveAirport(val){
           refs.airports.child("examiners/" +val+ "/" + userInfo.uid).set({
               name:{first: userInfo.name.first , last:userInfo.name.last},
               photoUrl:"https://firebasestorage.googleapis.com/v0/b/project-1750560572472647029.appspot.com/o/default-avitar.jpg?alt=media&token=e3c47907-735b-40bc-8954-164ba387c944" 
           });
           userRef.child('airports/'+val).set(true);                
        }
        
       function saveCertification(){
            var cert = $scope.certification;
            var user = {name: userInfo.name, photoUrl: $scope.user.photoUrl, certifications:$scope.user.certifications};
            var certRef = refs.certifications.child(cert.category);
            var certificationVal = cert.category + "/" + $scope.user.$id+ "/rating/"+cert.rating+"/" + cert.class;

            refs.certifications.child(certificationVal).set(true);
            refs.certifications.child(cert.category+"/"+$scope.user.$id).update({
                photoUrl:$scope.user.photoUrl,
                name: $scope.user.name 
            }) ;

            refs.user.child('certifications/'+ cert.category+"/" + "/rating/" +cert.rating+"/"+cert.class).set(true);
        }

       function saveChip(chip, type){
            if(chip.hasOwnProperty("$id") == false){
                  userRef.child( type+ "/" + chip).set(true);
                  userRef.child(type + "/" + chip).set(true);
                  return null ;
            }
      }
        
      function updateUser(){
            if($scope.user.newPassword){
                profileService.changePassword(refs.accounts.child(userInfo.uid), $scope.oldPassword, $scope.newPassword, $scope.user.emailAddress)
            };
            $scope.user.$save();
        }
    }