angular.module('pcNotificationsController',[])

    
    .controller('notificationsController', notificationsController)
            
    notificationsController.$inject = ["$scope",'pcServices','$localStorage'];
    function notificationsController($scope,pcServices,$localStorage){
        if($localStorage.currentUser){
             var userNotifications = pcServices.getCommonRefs().notifications.child($localStorage.currentUser.uid);
            this.notificationsList = pcServices.createFireArray(userNotifications); 
        }
    }