angular.module("userDirectives", [])

// the anchor tags have to be changed from local host to firebase hosting when Deploying
.directive("examinerNavbar", function($location){
   return{
       templateUrl:'app/users/views/examiner-menu.html',
       controller:function($scope){

            $scope.profile = function(){
                $location.path("/examiner/profile")
            }
            $scope.calendar = function(){
                console.log('ham');
                $location.path("/examiner/calendar");
            }
            $scope.messages = function(){
                $location.path("/examiner/messages")
            }
            
            $scope.home = function(){
                $location.path('/examiner')
            }
       }
   } 
})


.directive('studentHeader', function($location, $timeout){
   return{
            templateUrl:"app/users/views//studentHeader.html",
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
})

