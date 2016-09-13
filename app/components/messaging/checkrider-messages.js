angular.module("messages", ['firebase', 'commonServices', 'ngMaterial'])

.service('messagesService', [function(){
    return{
        sendMessage:function(userData, recipientData, msgObj){
            
            console.log(userData);
            console.log(recipientData);
            console.log(msgObj);
            
            var usersRef = new Firebase("https://checkride.firebaseio.com/users");
            var userId = userData.emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '');
            var recipientRef = usersRef.child(recipientData.$id);
            var userRef = usersRef.child(userId); 
            var recConvoRef = recipientRef.child("conversations/" + userId); 
            var userConvoRef = userRef.child("conversations/" + recipientData.$id);
            
            recConvoRef.child("messages").push(msgObj);
            userConvoRef.child('messages').push(msgObj);
            recConvoRef.update({
                lastReceivedMsg:new Date(Date.now()).toString(),
                hasNewMsg: true
            });
            userConvoRef.update({
                 lastReceivedMsg:new Date(Date.now()).toString(),
                  hasNewMsg: true
            });
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
            this.conversationsList= commonServices.createFireArray(conversationsRef);
            this.convoMessages = $scope.$resolve.conversations[$scope.$resolve.conversations.length-1].messages;
            this.convoInfo = $scope.$resolve.conversations[$scope.$resolve.conversations.length-1];
            this.view = false ;
            this.convo ='';
            commonServices.showToastOnEvent(conversationsRef, "child_added");
            this.viewConvoMessages = function(convo){
                conversationsRef.child(convo.$id).child("hasNewMsg").set(false);
                var messagesRef = conversationsRef.child(convo.$id + "/messages");
                this.convoMessages= $firebaseArray(messagesRef);
                this.convoInfo = convo ;
            };
            console.log('ham');
            this.sendReply = function(){
                console.log(this.convoInfo);
                var msgObj = {
                        body:this.body,
                        sender: userInfo.firstName + " " + userInfo.lastName,
                        order: Date.now(),
                        opened: false,
                        key:this.convoInfo.$id 
                }
                messagesService.sendMessage(userInfo, this.convoInfo, msgObj);
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