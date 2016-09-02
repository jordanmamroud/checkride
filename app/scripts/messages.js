var myApp = angular.module("messages", ['firebase', 'examinerDirectives', 'commonServices']);

angular.module('messages')
  .filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });

myApp.service('messagesService', [function(){
    return{
        sendMessage:function(fireRef, sender){
                        var convoRef = fireRef.child("conversations/" + sender);
                        var messageRef = fireRef.child("messages");
                        var msgObj = {
                                subject:"hame",
                                body: "vans",
                                sender: "sender",
                                order: Date.now(),
                                opened: false,
                                key:"janeyahoocom"
                        }
                        convoRef.child("lastReceivedMsg").set(new Date(Date.now()).toString());
                        convoRef.child("hasNewMsg").set(true);
                        convoRef.child("messages").push(msgObj),
                        messageRef.push(msgObj);  
        }
    }
}]);


myApp.directive("sendMessageModal", ['messagesService',function(messagesService){
    return{
        templateUrl:"app/shared/templates/directiveTemplates/sendMessageModal.html",
        scope:{
            sendTo:"=",
            sender:"=",
            modalId:"@"  
        },
        controller:function($scope){
            var sendToRef = new Firebase("https://checkride.firebaseio.com/users/"+ $scope.sendTo);
            $scope.sendMessage = function(){
                messagesService.sendMessage(sendToRef, $scope.sender);
                $("#"+ $scope.modalId).removeClass("showing");
            }
        }
    }
}]);


myApp.directive("messagesDirective",["$firebaseArray", "$firebaseObject","$filter", 'messagesService',"commonServices",function($firebaseArray, $firebaseObject, $filter, messagesService, commonServices){
    return{
        templateUrl: "app/shared/templates/directiveTemplates/messages.html",
        controller:function($scope){
            var userListRef = new Firebase("https://checkride.firebaseio.com/users");
            var authData = userListRef.getAuth();
            var userId = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');
            var userRef = userListRef.child(userId);
            var user =  $firebaseObject(userRef);
            var conversationsRef = userRef.child("conversations");
            var allMessagesRef = userRef.child("messages");
            var convoRef = conversationsRef.child('fabs');     
            $scope.conversationsList = $firebaseArray(conversationsRef);
            $scope.messagesList = $firebaseArray(allMessagesRef);
            $scope.view = false ;
            commonServices.showToastOnEvent(conversationsRef, "child_added");

            $scope.initializeConvoView = function(){
                $scope.conversationsList = $filter('orderBy')($scope.conversationsList, '-lastReceivedMsg');
            };

            $scope.viewConvoMessages = function(convo){   
                conversationsRef.child(convo.$id + "/hasNewMsg").set(false);
                var senderRef = conversationsRef.child(convo.$id + "/messages");
                $scope.convoMessagesList = $firebaseArray(senderRef);
                $scope.convo = convo.$id.toString();
            }

            $scope.viewMessageDetails = function(msg){
                $scope.sender = msg.sender ;
                $scope.message = msg.body ;
                $scope.senderRef = msg.key;
                console.log(msg.sender);
                allMessagesRef.child(msg.$id).update({opened: true});
            }


            $scope.sendMessage = function(){
                var senderRef = userListRef.child($scope.senderRef);
                messagesService.sendMessage(senderRef,$scope.sender );
            }
        }
    }
}]);