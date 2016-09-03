angular.module("crExaminer", [])

// the anchor tags have to be changed from local host to firebase hosting when Deploying
.directive("examinerNavbar", function($location){
   return{
       templateUrl:'app/shared/views/examinerFiles/examinerHeader.html',
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

