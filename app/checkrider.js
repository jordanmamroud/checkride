var checkrider = angular.module('checkrider',[
    'Checkrider.Routes',
    'Components.Module',
    'UserServices.Module',
    'firebase',
    'ui.bootstrap'
    ])


//Global Constants
.constant('GlobalConstants', {
    app : {
        name : "Checkrider",
        title : "Checkrider"
    }
    
})

//MAIN CONTROLLERS
.controller('index', ["$scope", "$location", 'GlobalConstants', function($scope,$location,GlobalConstants){
    $scope.name = GlobalConstants.app.name;
    
    
}])


//HEADER CONTROLLER
.controller('HeaderController', ["$scope", "$location",'RoutePaths', function($scope, $location, RoutePaths){
    $scope.$on('$routeChangeSuccess', function () {
        if($location.path() == '/search'){
            $scope.isSearch = true;    
        }else{
            $scope.isSearch = false;
        }
    });

    this.login = RoutePaths.login;
    this.signUp = RoutePaths.signUp;
    
}])

//FOOTER CONTROLLER
.controller('FooterController', ["$scope", function($scope){

}])



