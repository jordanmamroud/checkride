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
                this.listRef = '';
                this.recipientsList = commonServices.createFireArray(listRef);
                this.recipient = '';          
                this.sendMessage = function(){
                    var recipientData = JSON.parse(mg.recipient);
                    var recipientRef = new Firebase("https://checkride.firebaseio.com/users/" + recipientData.$id);
                    var msgObj = {
                            subject: this.subject,
                            body: this.body,
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
            var userInfo = commonServices.getCookieObj('currentUser');
            var userId = userInfo.emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '');
            var userRef = commonServices.getCommonRefs().usersRef.child(userId);
            var conversationsRef = userRef.child("conversations");
            var allMessagesRef = userRef.child("messages");
            this.conversationsList = commonServices.createFireArray(conversationsRef);
            this.messagesList = commonServices.createFireArray(allMessagesRef);
            this.view = false ;
            this.initializeConvoView = function(){
                this.conversationsList = $filter('orderBy')(msg.conversationsList, '-lastReceivedMsg');
            };
            commonServices.showToastOnEvent(conversationsRef, "child_added");
            this.viewConvoMessages = function(convo){   
                conversationsRef.child(convo.$id + "/hasNewMsg").set(false);
                var senderRef = conversationsRef.child(convo.$id + "/messages");
                this.convoMessagesList = $firebaseArray(senderRef);
                this.convo = convo.$id.toString();
            }
            this.viewMessageDetails = function(mesg){
                this.sender = mesg.sender ;
                this.message = mesg.body ;
                this.senderRef = mesg.key;
                console.log(msg.sender);
                allMessagesRef.child(thismesg.$id).update({opened: true});
            }

            this.sendMessage = function(){
                var senderRef = userListRef.child(this.sender);
                var msgObj = {
                        subject: this.subject,
                        body: this.body,
                        sender: this.sender,
                        order: Date.now(),
                        opened: false,
                        key:"janeyahoocom"
                }
                messagesService.sendMessage(userInfo, this.sender, msgObj);
            }
            
            if(userInfo.userType.toLowerCase() == "examiner"){
                this.listRef = "https://checkride.firebaseio.com/student" ;
            }
            if(userInfo.userType.toLowerCase() == "student"){
                this.listRef = "https://checkride.firebaseio.com/examiner" ;
            }
            
            this.op = function(){
                $mdDialog.show({
                    scope:$scope.$new(),
                    template:'<send-message-modal lister="msg.listRef"></send-message-modal>',
                    clickOutsideToClose:true
                });
            }
        }
    }
}]);