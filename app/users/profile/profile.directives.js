(function(){
    
angular.module('pcProfileDirective', [])

    .directive('accountDetails', ['pcServices','profileService', "AuthService", accountDetails])

    function accountDetails(pcServices,profileService, AuthService){
        return{
            templateUrl:function(){
                return "app/users/profile/accountDetails.html?" + Date.now(); 
            },
            scope:false,
            transclude:false,
            controller: function($scope,pcServices){
                
            }   
        }
    }
}());