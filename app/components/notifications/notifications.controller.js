angular.module('pcNotificationsController',[])

.controller('notificationsController', ["$scope",'pcServices','currentUser',function($scope,pcServices,currentUser){
    var refs= pcServices.getCommonRefs();
    var userNotifications = pcServices.getCommonRefs().notifications.child(currentUser.$id);
    this.notificationsList = pcServices.createFireArray(userNotifications); 
}])