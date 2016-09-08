var checkrider = angular.module('checkrider',[
    'ngCookies',
    'ngMaterial',    
    'ngAnimate',
    'ngAria',
    'firebase',
    'ngRoute',
    
    
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
.controller('crIndexCtrl', ["$scope","$cookies", "$location", 'GlobalConstants',function( $scope,$cookies,$location,GlobalConstants){
    $scope.name = GlobalConstants.app.name;
    this.view = false ;
    
    var setSidebarView = function(){
        var userType = $cookies.getObject("currentUser").userData.userType;
        if($location.path().indexOf("examiner") == -1 && $location.path().indexOf('student')==-1){
                        $scope.ba.view = false ;
                    }else{
                        $scope.ba.view = true ;

                        if(userType.toLowerCase() == 'examiner'){
                            $scope.examinerView = true;
                            $scope.studentView = false ;
                        }
                        if(userType =='Student'){
                            $scope.examinerView = false;
                            $scope.studentView = true ;
                        }
                    }
    }
    setSidebarView();

    $scope.$on('$locationChangeSuccess',function(){
            setSidebarView();
    });
}])



