var checkrider = angular.module('checkrider',[
    'ngCookies',
    'ngMaterial',    
    'ngAnimate',
    'ngAria',
    'firebase',
    
    
    'crRoutes',
    'crComponents',
    'crUserServices',
    'crUser',
    'crDirectives',
    'crSession',
    'commonServices',
    'crCalendar',
    'messages',
    'crLayout'
    
    ])


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



