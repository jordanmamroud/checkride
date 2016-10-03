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
            replace:true
        };
    }

    function crNavigation(){
        return {
            templateUrl:function(){
                return "app/layout/sidebar.html?" + Date.now();
            },
            scope: false,
            controller:sidebarController
        }
    }
    
   
    
    function sidebarController($scope, crUserNavData){
        $scope.navItems = navItems ; 

        function navItems(role){
            switch(role){
                case 'examiner': 
                    return crUserNavData.examiner ;
                    break;
                case 'student':
                    return crUserNavData.student ;
                    break;
                default : return null ;
            };
        }
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
