angular.module('pcSearch',[])
    .service('client', function (esFactory) {
      return esFactory({
        host: 'localhost:9200',
        apiVersion: '2.3',
        log: 'trace'
      });
    })

    .controller('SearchCtrl', function ($scope, client, esFactory) {
        client.cluster.state({
            metric: [
            'cluster_name',
            'nodes',
            'master_node',
            'version'
        ]
      })
      .then(function (resp) {
            $scope.clusterState = resp;
            $scope.error = null;
      })
      .catch(function (err) {
        $scope.clusterState = null;
        $scope.error = err;
        // if the err is a NoConnections error, then the client was not able to
        // connect to elasticsearch. In that case, create a more detailed error
        // message
        if (err instanceof esFactory.errors.NoConnections) {
          $scope.error = new Error('Unable to connect to elasticsearch. ' +
            'Make sure that it is running and listening at http://localhost:9200');
        }
      });


 });








/*
crComponents.controller('crSearchCtrl',["$scope", "$window", "$firebaseArray",'$cookies', function($scope, $window, $firebaseArray, $cookies){

        var ref = new Firebase("https://checkride.firebaseio.com");


        $scope.searchBox=null;
        $scope.examiners=null;

        $scope.search = function(query){
            ref.orderByChild("examiner").on('child_added', function(snapshot){
                $scope.examiners = snapshot.val();
                console.log(snapshot.val().userData);
            });
        };
        var currUsr = $cookies.getObject('currentUser');
        console.log(currUsr);
    }])
*/










//.factory('examinerSearch', ["$firebase", function examinerSearchFactory(searchQuery){   }]);
        

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
