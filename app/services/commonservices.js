angular.module('commonServices', [])

.service("commonServices", ['RoutePaths',"$location",'$routeParams','$timeout',"$firebaseArray",'$firebaseObject', '$filter', '$cookies',  function(RoutePaths,$location, $routeParams, $timeout,$firebaseArray, $firebaseObject, $filter, $cookies){
    return{
        
        // firebaseRef: function(){
        //     return new Firebase(globalConst.firebase.ref);
        // },

        getRoutePaths:function(){
            return RoutePaths
        },
        changePath: function(urlString){
                $timeout(function(){
                         $location.path(urlString)
                    },1);
        },
        getPath:function(){
            return $location.path();
        },
        
        orderArray: function(list, orderBy){
            list = $filter('orderBy')(list, orderBy);
        },
        
        showToastOnEvent: function(ref,event){
            ref.on(event, function (datasnapshot){
                        $('.toast').fadeIn(400).delay(3000).fadeOut(400);
            });
        },
        
        getCookie: function(key){
            return $cookies.get(key);
        },
        
        getCookieObj: function(key){
            return $cookies.getObject(key);  
        },
        
        setCookie: function(key){
            return $cookies.set(key);//This sets strings  
        },
        
        setCookieObj:function(key, obj){
            $cookies.putObject(key, obj);//This sets objects
        },
        removeCookieObj: function(key){
            $cookies.remove(key);
        },
        createFireObj: function(ref){
            return $firebaseObject(ref)
        },
        
        createFireArray: function(ref){
            return $firebaseArray(ref);
        },
        createLoadedFireArray:function(ref){
            $firebaseArray(ref).$loaded().then(function(){
                console.log('ham');
                return $firebaseArray(ref);
            })
        },
        getRouteParams:function(){
            return $routeParams ;
        },
        getCommonRefs:function(){
            return{
                usersRef: new Firebase("https://checkride.firebaseio.com/users")
            }
        }
        
    }
}])
