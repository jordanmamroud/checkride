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
            var usersRef = new Firebase("https://checkride.firebaseio.com/users");
            var userId = userData.emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '');
            var recipientRef = usersRef.child(recipientData.$id);
            var userRef = usersRef.child(userId); 
            console.log(userId);
            var recConvoRef = recipientRef.child("conversations/" + userId);
            var recMessageRef = recipientRef.child("messages");    
            var userConvoRef = userRef.child("conversations/" + recipientData.$id);
            var userMessagesRef = userRef.child("messages");
            recConvoRef.update({
                lastReceivedMsg:new Date(Date.now()).toString(),
                hasNewMsg: true
            });
            recConvoRef.child("messages").push(msgObj);
            recipientRef.child('messages').push(msgObj);  
            userConvoRef.child('messages').push(msgObj);
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
                var userInfo = commonServices.getCookieObj('currentUser');
                var listRef = new Firebase($scope.lister);
                this.listRef = '';
                this.recipientsList = commonServices.createFireArray(listRef);
                this.recipient = '';          
                this.sendMessage = function(){
                    var recipientData = JSON.parse(this.recipient);
                    var recipientRef = new Firebase("https://checkride.firebaseio.com/users/" + recipientData.$id);
                    var msgObj = {
                            body: this.body,
                            sender: userInfo.firstName + " " + userInfo.lastName,
                            order: Date.now(),
                            opened: false,
                            key:"janeyahoocom"
                    }
                    messagesService.sendMessage(userInfo, recipientData, msgObj);
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
            this.convo= [1,2,3,4,5]
            this.messagesList = commonServices.createFireArray(allMessagesRef);
            this.view = false ;
            this.initializeConvoView = function(){
                this.conversationsList = $filter('orderBy')(this.conversationsList, '-lastReceivedMsg');
            };
            commonServices.showToastOnEvent(conversationsRef, "child_added");
            this.viewConvoMessages = function(convo){
                conversationsRef.child(convo.$id + "/hasNewMsg").set(false);
                var senderRef = conversationsRef.child(convo.$id + "/messages");
                this.convoMessagesList = $firebaseArray(senderRef);
                this.convo = convo;
                console.log(convo);
                console.log(conversationsRef.child(convo.$id))
                this.convo = $firebaseArray(conversationsRef.child(convo.$id+"/messages"));
                console.log(this.convo);
            };
            this.viewMessageDetails = function(mesg){
                this.sender = mesg.sender ;
                this.message = mesg.body ;
                this.senderRef = mesg.key;
                console.log(msg.sender);
                allMessagesRef.child(thismesg.$id).update({opened: true});
            };
            this.sendMessage = function(){
                var msgObj = {
                        body: "this.body",
                        sender: userInfo.firstName +" " + userInfo.lastName,
                        order: Date.now(),
                        opened: false,
                        key:this.convo.$id 
                }
                messagesService.sendMessage(userInfo, this.convo, msgObj);
            };
            if(userInfo.userType.toLowerCase() == "examiner"){
                this.listRef = "https://checkride.firebaseio.com/student" ;
            };
            if(userInfo.userType.toLowerCase() == "student"){
                this.listRef = "https://checkride.firebaseio.com/examiner" ;
            };
            this.op = function(){
                $mdDialog.show({
                    scope:$scope.$new(),
                    template:'<send-message-modal lister="msg.listRef"></send-message-modal>',
                    clickOutsideToClose:true
                });
            };
        }
    }
}]);