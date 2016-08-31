'use strict';

angular.module('checkrider.routes',['ngRoute']);
angular.module('checkrider.components',[]);



var checkrider = angular.module('checkrider',[
    'checkrider.routes',
    'checkrider.components',
    'firebase',
    'ui.bootstrap'
    ])
    //CONTROLLERS
    .controller('index', ["$scope", "$location", function($scope,$location){
        $scope.appName = "Checkrider";    
        $scope.title = "Checkrider";

        $scope.mainMenu = {
            'PPL':'Private Pilot Certificate',
            'CPL':'Commercial Pilot Certificate',
            'SPL':'Sport Pilot Certificate'
        };

    }])





