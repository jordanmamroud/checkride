angular.module('crControllers',[])

//MAIN CONTROLLER
.controller('crIndexCtrl', ["$scope","$cookies", "$location", 'globalConst',function( $scope,$cookies,$location,globalConst){
}])

//LAYOUT CONTROLLER
.controller('crLayoutCtrl', ["$scope", "$location",'RoutePaths','$cookies', function($scope, $location, RoutePaths, $cookies){
    var user = $cookies.getObject('currentUser');
    $scope.showSidebar = null;
    $scope.$on('$routeChangeSuccess', function (){
        $scope.showSidebar = ($location.path().indexOf('/user/') > -1);
    })
}])


//HEADER CONTROLLER
.controller('crHeaderCtrl', ["$scope", "$location",'RoutePaths','$cookies', function($scope, $location, RoutePaths, $cookies){
    
}])


//SIDEBAR CONTROLLER
.controller('crSidebarCtrl', ['$scope', '$cookies', '$location', function($scope,$cookies,$location){
    

}])



//FOOTER CONTROLLER
.controller('crFooter', ["$scope", function($scope){

}])