var app = angular.module('commonServices', []);

app.service("commonServices", ["$location",'$timeout', function($location, $timeout){
    return{
        
        changePath: function(urlString){
                $timeout(function(){
                         $location.path("/createAccount")
                    },1);
            },
        
        orderArray: function(list, orderBy){
            list = $filter('orderBy')(list, orderBy);
        },
        
        showToastOnEvent: function(ref,child,event){
            ref.child(child).on(event, function (datasnapshot){
                                $('.toast').fadeIn(400).delay(3000).fadeOut(400);
            });
        },
        
        setDataField: function(fireData, selector){
            fireData.$loaded().then(function(){
               $(selector).text(fireData.userData.firstName + " " + fireData.userData.lastName); 
            });
        }  
    }
}]);
