angular.module("messages", ['firebase', 'commonServices', 'ngMaterial'])

/*

.filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  })
*/

.service('messagesService', [function(){
    return{
        sendMessage:function(userData, recipientData, msgObj){
            
            var recipientRef = new Firebase("https://checkride.firebaseio.com/users/" + recipientData.$id);
            var userRef = new Firebase("https://checkride.firebaseio.com/users/" + userData.$id); 
            var recConvoRef = recipientRef.child("conversations/" + userData.$id);
            var recMessageRef = recipientRef.child("messages");    
            var userConvoRef = userRef.child("conversations/" + recipientData.$id);
            var userMessagesRef = userRef.child("messages");
            recConvoRef.update({
                lastReceivedMsg:new Date(Date.now()).toString(),
                hasNewMsg: true
            });
            
            recConvoRef.child("messages").push(msgObj);
            recMessageRef.push(msgObj);  
            userConvoRef.push(msgObj);
            userMessagesRef.push(msgObj);
        }
    }
}])

.directive("sendMessageModal", ['messagesService', 'commonServices',function(messagesService, commonServices){
    return{
        templateUrl:function(){
            return "app/components/messaging/sendMessageModal.html?" +new Date();
        },
        scope:{
            lister:"=",
            sender:"=",
            modalId:"@"  
        },
        controllerAs:'mg',
        controller:function($scope){

                var mg =this ;
                var userData = commonServices.getCookie('currentUser');
                var listRef = new Firebase($scope.lister);
                mg.listRef = '';
                mg.recipientsList = commonServices.createFireArray(listRef);
                mg.recipient = '';          
                mg.sendMessage = function(){
                    var recipientData = JSON.parse(mg.recipient);
                    var recipientRef = new Firebase("https://checkride.firebaseio.com/users/" + recipientData.$id);
                    var msgObj = {
                            subject: mg.subject,
                            body: mg.body,
                            sender: userData.userData.firstName + " " + userData.userData.lastName,
                            order: Date.now(),
                            opened: false,
                            key:"janeyahoocom"
                    }
                    messagesService.sendMessage(userData, recipientData, msgObj);
                }
        }
    }
}])

.directive("messagesDirective", ["$firebaseArray", "$firebaseObject","$filter", 'messagesService',"commonServices",'$mdDialog',function($firebaseArray, $firebaseObject, $filter, messagesService, commonServices,$mdDialog){
    return{
        templateUrl: function(){
             return "app/components/messaging/messages.html?" + new Date();
        },
        controllerAs:"msg",
        controller:function($scope){
            var msg = this;
            var userInfo = commonServices.getCookie('currentUser');
            console.log(userInfo);
            var userListRef = new Firebase("https://checkride.firebaseio.com/users");
            var authData = userListRef.getAuth();
            var userId = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');
            var userRef = userListRef.child(userId);
            var user =  $firebaseObject(userRef);
            var conversationsRef = userRef.child("conversations");
            var allMessagesRef = userRef.child("messages");
            var convoRef = conversationsRef.child('fabs');  
            
            msg.conversationsList = $firebaseArray(conversationsRef);
            msg.messagesList = $firebaseArray(allMessagesRef);
            msg.view = false ;
            commonServices.showToastOnEvent(conversationsRef, "child_added");

            msg.initializeConvoView = function(){
                msg.conversationsList = $filter('orderBy')(msg.conversationsList, '-lastReceivedMsg');
            };

            msg.viewConvoMessages = function(convo){   
                conversationsRef.child(convo.$id + "/hasNewMsg").set(false);
                var senderRef = conversationsRef.child(convo.$id + "/messages");
                msg.convoMessagesList = $firebaseArray(senderRef);
                msg.convo = convo.$id.toString();
            }

            msg.viewMessageDetails = function(mesg){
                msg.sender = mesg.sender ;
                msg.message = mesg.body ;
                msg.senderRef = mesg.key;
                console.log(msg.sender);
                allMessagesRef.child(msg.$id).update({opened: true});
            }

            msg.sendMessage = function(){
                var senderRef = userListRef.child(msg.sender);
                var msgObj = {
                        subject: msg.subject,
                        body: msg.body,
                        sender: msg.sender,
                        order: Date.now(),
                        opened: false,
                        key:"janeyahoocom"
                }
                messagesService.sendMessage(senderRef, msg.sender, msgObj);
            }
            
            if(userInfo.userData.userType.toLowerCase() == "examiner"){
                msg.listRef = "https://checkride.firebaseio.com/student" ;
            }
            if(userInfo.userData.userType.toLowerCase() == "student"){
                msg.listRef = "https://checkride.firebaseio.com/examiner" ;
            }

            msg.op = function(){
                $mdDialog.show({
                    scope:$scope.$new(),
                    template:'<send-message-modal lister="msg.listRef"></send-message-modal>',
                    clickOutsideToClose:true
                });
        }
    }
    }
}]);