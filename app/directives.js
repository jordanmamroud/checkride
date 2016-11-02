angular.module('pcCommonDirectives', [])

.directive('myAutoComplete', myAutoComplete);


    
function myAutoComplete(){
    return{
        scope:{
            myoptions:"="
        },
        templateUrl: function(){
            return "example.html?"+ Date.now();
        },
        controller:function($firebaseAuth, $firebaseObject, $state,  $scope, $http){
                $scope.selected = undefined;
                $scope.states = ['Alabama', 'Alaska', 'Arizona'];

        }
    }
}



