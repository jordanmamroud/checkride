angular.module('crLayout',[])


.controller('crLayoutCtrl', ["$scope", "$location",'RoutePaths','$cookies', function($scope, $location, RoutePaths, $cookies){
    var user = $cookies.getObject('currentUser');
    this.showSidebar = false;
    
    $scope.$on('$routeChangeSuccess', function () {
        
        console.log('New Path' + $location.path().indexOf('/user/'));
        
        if($location.path().indexOf('/user/') > -1){
            
            this.showSidebar = true;
            console.log(this.showSidebar);    
        }else{
                this.showSidebar = false;
            }
        })
}])


//HEADER CONTROLLER
.controller('crHeaderCtrl', ["$scope", "$location",'RoutePaths','$cookies', function($scope, $location, RoutePaths, $cookies){
    
/*    $scope.$on('$routeChangeSuccess', function () {
        if($location.path() == '/search'){
            $scope.isSearch = true;    
        }else{
            $scope.isSearch = false;
        }
    });
    
    $scope.goToLogin = 
    this.login = RoutePaths.login;
    this.signUp = RoutePaths.signUp;*/
    
}])


//SIDEBAR CONTROLLER
.controller('crSidebarCtrl', ['$scope', '$cookies', '$location', function($scope,$cookies,$location){
    

}])



//FOOTER CONTROLLER
.controller('crFooter', ["$scope", function($scope){

}])