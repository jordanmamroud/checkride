//TODO: add user query service
//Should be one service to accept user type argument (along with other optional) / May have to be multiple services

angular.module('pcDataService',[])
.service('dataService',['$firebaseObject', 'globalConst', '$q', function($firebaseObject,globalConst,$q){
    
    
    return {
        
        getAirports: function(scope,query){
            var ref = new Firebase(globalConst.database.airportsRef).limitToFirst(10);
            var data = $firebaseObject(ref);
            
            return $q(function(resolve,reject){
                data.$loaded()
                    .then(function(data){
                        return resolve(data);
                    })
                    .catch(function(error) {
                        console.error("Error:", error);
                    });
            });
        },
        
        getUsers: function(scope,userType){
            var ref = new Firebase(globalConst.database.usersRef).limitToFirst(10);
            var data = $firebaseObject(ref);
            
            return $q(function(resolve,reject){
                data.$loaded()
                    .then(function(data){
                        return resolve(data);
                    })
                    .catch(function(error) {
                        console.error("Error:", error);
                    });
            });
        },
        
        getUserData: function(){
            var ref = new Firebase(globalConst.database.usersRef);
            var data = $firebaseObject(ref);
            var data2;
            
            ref.orderByChild('userData').equalTo('Examiner').once('value',function(snapshot){
                snapshot.forEach(function(subShot){
                    console.log(1);
                });
                console.log(snapshot);
            });
            
            console.log(ref);
            console.log(data);
            console.log(data2);
        }
        
        
        
    }
}])