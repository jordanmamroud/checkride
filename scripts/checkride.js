var checkrideApp = angular.module('checkrideApp',['ngRoute'])

.config(function($routeProvider, $locationProvider){
    $routeProvider
    
        .when('/', {
            templateUrl : 'site/home.html',
            controller : 'index'
        })
    
        .when('/about', {
            templateUrl : 'site/about.html',
            //controller : 'aboutController'
        })
        .when('/search', {
            templateUrl : 'site/how-it-works.html',
            //controller : 'howController'
        })
        .otherwise({
            redirectTo:'site/home.html'
        });
    
    //$locationProvider.html5Mode(true);
})

.controller('index', function($scope){
    $scope.title = "Pretty Sweet!";
    $scope.title = "Pretty Sweet!";
    
    $scope.mainMenu = ['about','search','airports'];
})

.controller('aboutController', function($scope){
   $scope.message = " About Page!";
    $scope.title= "About Checkride";
})

.controller('howController', function($scope){
   $scope.message = " How it Works Page!"; 
})

.controller('headerController', function($scope){
    
})

.controller('footerController', function($scope){
    
})

.directive("header", function(){
    return{
      restrict: 'A',
        templateUrl: 'directives/header.html',
        scope: true,
        transclude: false,
        controller: 'headerController'
    };
})

.directive("footer", function(){
    return{
      restrict: 'A',
        templateUrl: 'directives/footer.html',
        scope: true,
        transclude: false,
        controller: 'footerController'
    };
});