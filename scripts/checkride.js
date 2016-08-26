var checkrideApp = angular.module('checkrideApp',['ngRoute'])

.config(function($routeProvider, $locationProvider){
    $routeProvider
    
        .when('/', {
            templateUrl : 'site/home.html',
            controller : 'mainController'
        })
    
        .when('/about', {
            templateUrl : 'site/about.html',
            controller : 'aboutController'
        })
        .when('/how-it-works', {
            templateUrl : 'site/how-it-works.html',
            controller : 'howController'
        })
        .otherwise({
            redirectTo:'site/home.html'
        });
    
    $locationProvider.html5Mode(true);
})

.controller('mainController', function($scope){
    $scope.message = "Pretty Sweet!";
})


.controller('aboutController', function($scope){
   $scope.message = " About Page!"; 
})

.controller('howController', function($scope){
   $scope.message = " How it Works Page!"; 
});