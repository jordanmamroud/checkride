var myApp = angular.module("studentDirectives",[]);

myApp.directive('studentHeader', function($location){
   return{
            templateUrl:"app/shared/views/StudentFiles/studentHeader.html",
            controller:function($scope){
                    $scope.msg = function(){
                        $location.path("/student/messages");
                    }    
                    $scope.examinersList = function(){
                        $location.path("/student")
                    }
            }
        } 
});

