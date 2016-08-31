'use strict';

angular.module("Components.Module",[])

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

    .controller('searchController',["$scope", "$window", "$firebaseArray", function($scope, $window, $firebaseArray){

        //var ref = new Firebase("https://checkride.firebaseio.com/");
        var ref = new Firebase("https://checkride.firebaseio.com");
        //var authData = ref.getAuth();
        //var studentRef = ref.child("student/" + authData.password.email.replace( /[\*\^\.\'\!\@\$]/g , ''));

        //$scope.list = $firebaseArray(examinersRef);    

        // when the a student clicks schedule button it will go to the profile of the selected examiner
        //var goToProfile = function(ref){
            //$scope.scheduleButtonEvent = function(index){
                //ref.child("currentExaminer").set($scope.list[index].userData.emailAddress.replace(/[\*\^\.\'\!\@\$]/g , ''));
                //$window.location.href ="https://checkride.firebaseapp.com/StudentFiles/examinerAvailability.html";
                  //$window.location.href = "../StudentFiles/viewProfileFiles/examinerInfo.html?username=" + 
                    //$scope.list[index].userData.emailAddress.replace(/[\*\^\.\'\!\@\$]/g , '');
            //}
        //}

        //goToProfile(studentRef);


        //var ref = new Firebase("https://checkride.firebaseio.com/");


        $scope.searchBox=null;
        $scope.examiners=null;

        $scope.search = function(query){
            ref.orderByChild("examiner").on('child_added', function(snapshot){
                $scope.examiners = snapshot.val();
                console.log(snapshot.val().userData);
            });
        };

    }])










    //.factory('examinerSearch', ["$firebase", function examinerSearchFactory(searchQuery){   }]);
    
    
    
    
    
   