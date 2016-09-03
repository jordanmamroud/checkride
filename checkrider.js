var checkrider = angular.module('checkrider',[
    'crRoutes',
    'crComponents',
    'crUser',
    'crDirectives',
    
    'ngMaterial',    
    'ngAnimate',
    'ngAria',
    
    'firebase',
    
    /*
    'Components.Module',
    'UserServices.Module',
    'crExaminer',
    'ui.bootstrap',
    'ui.calendar',    
    'examinerCalendar',
    'loginMod',
    "createAccountPage",
    'messages', 
    'profile', 
    'examinerControllers', 
    'studentMod',
    'studentDirectives'
    */
    ]).config(['$logProvider',function($logProvider){
        $logProvider.debugEnabled(true);

    }])


//Global Constants
.constant('GlobalConstants', {
    app : {
        name : "Checkrider",
        title : "Checkrider"
    }
})


//MAIN CONTROLLERS
.controller('crIndexCtrl', ["$scope", "$location", 'GlobalConstants',function($scope,$location,GlobalConstants){
    $scope.name = GlobalConstants.app.name;
    
   
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

    this.login = RoutePaths.login;
    this.signUp = RoutePaths.signUp;
    
}])

//FOOTER CONTROLLER
.controller('crFooter', ["$scope", function($scope){

}]);
