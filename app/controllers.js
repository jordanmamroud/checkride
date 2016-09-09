angular.module('crControllers',[])

//MAIN CONTROLLER
.controller('crIndexCtrl', ["$scope","$cookies", "$location", 'GlobalConstants',function( $scope,$cookies,$location,GlobalConstants){
    $scope.name = GlobalConstants.app.name;
    this.view = false ;
    
    var setSidebarView = function(){
        
        var user = $cookies.getObject('currentUser');
        var userType = user ? user.userData.userType : null;
        
        if($location.path().indexOf("examiner") == -1 && $location.path().indexOf('student')==-1){
                        $scope.view = false ;
                    }else{
                        $scope.view = true ;

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

//LAYOUT CONTROLLER
.controller('crLayoutCtrl', ["$scope", "$location",'RoutePaths','$cookies', function($scope, $location, RoutePaths, $cookies){
    
    var user = $cookies.getObject('currentUser');
    $scope.showSidebar = null;
    
    $scope.$on('$routeChangeSuccess', function () {
        
        $scope.showSidebar = ($location.path().indexOf('/user/') > -1);
    })
}])


//HEADER CONTROLLER
.controller('crHeaderCtrl', ["$scope", "$location",'RoutePaths','$cookies', function($scope, $location, RoutePaths, $cookies){
    
/*    $scope.$on('$routeChangeSuccess', function () {
        if($location.path() == '/search'){
            $scope.isSearch = true;    
        }else{
            $scope.isSearch = false;
        }
    });
    
    $scope.goToLogin = 
    this.login = RoutePaths.login;
    this.signUp = RoutePaths.signUp;*/
    
}])


//SIDEBAR CONTROLLER
.controller('crSidebarCtrl', ['$scope', '$cookies', '$location', function($scope,$cookies,$location){
    

}])



//FOOTER CONTROLLER
.controller('crFooter', ["$scope", function($scope){

}])