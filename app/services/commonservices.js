var app = angular.module('commonServices', []);

app.service("commonServices", ["$location",'$routeParams','$timeout',"$firebaseArray",'$firebaseObject', '$filter', '$cookies',function($location, $routeParams, $timeout,$firebaseArray, $firebaseObject, $filter, $cookies){
    return{
        
        changePath: function(urlString){
                $timeout(function(){
                         $location.path(urlString)
                    },1);
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
            return $cookies.getObject(key);
        },
        
        setCookieObj:function(key, obj){
            $cookies.putObject(key, obj);
        },
        
        createFireObj: function(ref){
            return $firebaseObject(ref)
        },
        
        createFireArray: function(ref){
            return $firebaseArray(ref);
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
}]);
