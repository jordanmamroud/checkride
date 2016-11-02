(function(){
	angular.module('pcServices', [])


	.service("pcServices", ['RoutePaths',"$location",'$routeParams','$timeout',"$firebaseArray","$firebaseObject", '$filter', '$cookies','firebaseRefs',"$sessionStorage","$firebaseAuth",'$localStorage',
		function(RoutePaths,$location, $routeParams, $timeout,$firebaseArray, $firebaseObject, $filter, $cookies,firebaseRefs,$sessionStorage,$firebaseAuth,$localStorage){


            var service = {
                getUserRefs:function(){
                    var userId = $locationStorage.currentUser.uid;
                
                },
                getAuth: getAuth,

                firebaseRef: function(){
    //				return new Firebase(globalConst.firebase.ref);
                },

                getRoutePaths:function(){return RoutePaths},

                changePath: changePath,

                getPath:function(){return $location.path();},

                orderArray: function(list, orderBy){list = $filter('orderBy')(list, orderBy);},

                showToastOnEvent: showToastOnEvent,

                getCookie: function(key){return $cookies.get(key);},

                getCookieObj: function(key){return $cookies.getObject(key);},

                setCookie: function(key){return $cookies.set(key);},

                setCookieObj:function(key, obj){$cookies.putObject(key, obj);},

                removeCookieObj: function(key){$cookies.remove(key);},

                createFireObj: function(ref){return $firebaseObject(ref)},

                firebaseObject: function(ref){return $firebaseObject(ref);},
                createFireArray: function(ref){return $firebaseArray(ref);},

                getRouteParams:function(){ return $routeParams ;},
                getCommonRefs:getCommonRefs,
                
                showModal: showModal,

                objToArray:objToArray
        }  
            
        return service
            
        function getAuth(){
            var auth = $firebaseAuth();
            var authObj = auth.$getAuth();
            return authObj ;
        }
            
        function changePath(urlString){
            $timeout(function(){
                     $location.path(urlString)
                },1);
        }
            
        function showToastOnEvent(ref,event){
            ref.on(event, function (datasnapshot){
                $('.toast').fadeIn(400).delay(3000).fadeOut(400);
            });
        }
        
        function showModal(id, clickOutToClose){
            $mdDialog.show({
                 templateUrl:id,
                 clickOutsideToClose: clickOutToClose
            })         
        }
        
        function objToArray(object, arrayType){
            var array = [];
            angular.forEach(object, function(value, key){
                switch(arrayType){
                    case "key" : this.push(key)
                        break;
                    case "value" : this.push(value)
                        break;
                    default : this.push(key + ": " + value)
                        break;
                }

            },array);
            return array;
        }    
            
        function getCommonRefs(){          

            var rootRef = firebase.database().ref();
            var main =rootRef.child("temp");
            var userId ;
            if($localStorage.currentUser){
                userId = $localStorage.currentUser.uid;
            }
            return{
                accounts:main.child('users/accounts'),
                airports: main.child('airports'),
                certifications: main.child('certifications'),
                conversations: main.child('conversations'),
                calendars: main.child('calendars'),
                examiners:main.child('users/roles/examiner'),
                main: main,
                notifications: main.child("notifications"),
                roles:main.child('users/roles'),
                root:rootRef,
                students:main.child('users/roles/student'),
                user: main.child('users/accounts/'+ userId),
                userCalendar: main.child('calendars/'+userId),
                userConversations:main.child("conversations/" +userId)
            }
        } 
	}])
})()