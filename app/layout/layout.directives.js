(function(){

	angular.module('pcLayoutDirectives',[])

    .directive('crHeader', crHeader)
    
	.directive('crNavigation', crNavigation)
    
    .directive("pcSessionStatus", ['pcServices','profileService', pcSessionStatus ])
    
     sidebarController.$inject = ['$scope', 'crUserNavData'];
    
    function crHeader(){
        return{
            templateUrl: function(){
                return 'app/layout/header.html?'+Date.now()
            },
            scope: false,
            transclude: false,
           
        };
    }

    function crNavigation(){
        return {
            templateUrl:function(){
                return "app/layout/sidebar.html?" + Date.now();
            },
            scope: false,
            controller: sidebarController
        }
    }
    
    function sidebarController($scope){
        
    }
    
    function pcSessionStatus(pcServices, profileService){
        return {
            templateUrl:function(){
             return "app/layout/sessionStatus.html?" + Date.now();   
            },
            scope:false
        }
    }
})()
