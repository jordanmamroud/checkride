var myApp = angular.module("studentDirectives",[]);

myApp.directive('studentHeader', function($location, $timeout){
   return{
            templateUrl:"app/shared/views/StudentFiles/studentTemplates/studentHeader.html",
            controller:function($scope){
                    $scope.home = function(){
                        $location.path("/student");
                    }
                    $scope.msg = function(){
                        $location.path("/student/messages");
                    }    
                    $scope.examinersList = function(){
                      $location.path("/student/examinersList")
                    }
            }
        } 
});

