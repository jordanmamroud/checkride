angular.module('crLayout',[])

.controller('crSidebarCtrl', ['$scope', '$cookies', function($scope,$cookies){
    
    var user = $cookies.getObject('currentUser');
    console.log(user);
    
}])


//HEADER CONTROLLER
.controller('crHeaderCtrl', ["$scope", "$location",'RoutePaths', function($scope, $location, RoutePaths){
    $scope.$on('$routeChangeSuccess', function () {
        if($location.path() == '/search'){
            $scope.isSearch = true;    
        }else{
            $scope.isSearch = false;
        }
    });
    
    $scope.goToLogin = 
    this.login = RoutePaths.login;
    this.signUp = RoutePaths.signUp;
    
}])

//FOOTER CONTROLLER
.controller('crFooter', ["$scope", function($scope){

}])

/*.directive('crSidebar', function(){
    return{

        controller:function($scope){
            
            $scope.profile = function(){
                $location.path("/examiner/profile")
            }
              
            $scope.calendar = function(){
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
});*/