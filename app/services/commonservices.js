var app = angular.module('commonServices', []);

app.service("commonServices", ["$location",'$timeout', '$filter',function($location, $timeout, $filter){
    return{
        
        changePath: function(urlString){
                $timeout(function(){
                         $location.path("/createAccount")
                    },1);
            },
        
        orderArray: function(list, orderBy){
            list = $filter('orderBy')(list, orderBy);
        },
        
        showToastOnEvent: function(ref,event){
            ref.on(event, function (datasnapshot){
                        $('.toast').fadeIn(400).delay(3000).fadeOut(400);
            });
        }
    }
}]);
