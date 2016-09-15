angular.module("messages", ['firebase', 'commonServices', 'ngMaterial'])

.service('messagesService', ['commonServices',function(commonServices){
    var refs = commonServices.getCommonRefs();
    return{
            createConvo:function(userData, recipientData, msgObj){
                var userRef = refs.accounts.child(userData.$id);
                console.log(userData);
                var recipientRef = refs.accounts.child(recipientData.$id);
                var userConvo = userRef.child("conversations");
                var convo = refs.conversations.push();
                refs.conversations.child(convo.key() + '/messages').push(msgObj);
                refs.conversations.child(convo.key() +'/users').child(userData.$id).set({
                    name:userData.firstName + " " + userData.lastName, id:userData.$id
                });
                refs.conversations.child(convo.key()+'/users').child(userData.$id).set({
                    name:recipientData.firstName+" " + recipientData.lastName, id:recipientData.$id
                });
                console.log(userConvo.toString());
                userConvo.child(convo.key()).set({
                    lastReceivedMsg:new Date(Date.now()).toString(),
                    hasNewMsg: true,
                    users:{name: recipientData.name, id:recipientData.$id}
                });
                recipientRef.child("conversations/"+ convo.key()).set({
                    lastReceivedMsg:new Date(Date.now()).toString(),
                    hasNewMsg: true,
                    users:{name:userData.firstName+ " " + userData.lastName,id: userData.$id}
                });
            },
            sendReply:function(convoInfo, msgObject){
                refs.conversations.child(convoInfo.$id +"/messages").push(msgObject);
            }
        }
    }
])

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
                var refs = commonServices.getCommonRefs();
                if(userInfo.userType.toLowerCase() == "examiner"){
                    this.recipientsList = commonServices.createFireArray(refs.students)
                };
                if(userInfo.userType.toLowerCase() == "student"){
                    this.recipientsList = commonServices.createFireArray(refs.examiners);
                };
                this.recipient = '';          
                this.sendMessage = sendMessage ;
                function sendMessage(){
                    var msgObj = {
                            body: this.body,
                            sender: userInfo.firstName + " " + userInfo.lastName,
                            order: Date.now(),
                            opened: false,
                            key:"janeyahoocom"
                    }
                    messagesService.createConvo(userInfo, JSON.parse(this.recipient), msgObj);
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
            var refs = commonServices.getCommonRefs();
            var userInfo = commonServices.getCookieObj('currentUser');
            var userRef = refs.accounts.child(userInfo.$id);
            var conversationsRef = userRef.child("conversations");
            this.conversationsList = commonServices.createFireArray(conversationsRef);
            this.convoInfo = $scope.$resolve.conversations[$scope.$resolve.conversations.length-1];
            console.log(this.convoInfo);
            if(this.convoInfo != undefined){
             this.convoMessages = commonServices.createFireArray(refs.conversations.child(this.convoInfo.$id + "/messages"));
            }
           
            this.view = false ;
            this.convo ='';    
            
            //functions that are being called
            commonServices.showToastOnEvent(conversationsRef, "child_added");
            setRecipientsList();
            this.viewConvoMessages = viewConvoMessages ;
            this.sendReply = sendReply;
            this.op = createSendMsgDialog;
            
    
            function viewConvoMessages(convo){
                conversationsRef.child(convo.$id).child("hasNewMsg").set(false);
                console.log(convo)
                var messagesRef = refs.conversations.child(convo.$id + "/messages");
                this.convoMessages= $firebaseArray(messagesRef);
                this.convoInfo = convo ;
            };
            
            function sendReply(){
                var msgObj = {
                            body:this.body,
                            sender: userInfo.firstName + " " + userInfo.lastName,
                            order: Date.now(),
                            opened: false,
                            key:this.convoInfo.$id 
                }
                refs.conversations.child(this.convoInfo.$id +"/messages").push(msgObj);
                refs.accounts.child(this.convoInfo.users.id).update({
                    lastReceivedMsg:new Date(Date.now()).toString(),
                    hasNewMsg: true
                });
                var messagesRef = refs.conversations.child(this.convoInfo.$id + "/messages");
                this.convoMessages = $firebaseArray(messagesRef);
            };
                 
            function setRecipientsList(){
                if(userInfo.userType.toLowerCase() == "examiner"){
                    this.listRef =refs.examiners
                };
                if(userInfo.userType.toLowerCase() == "student"){
                    this.listRef = refs.students;
                };
            };

            function createSendMsgDialog(){
                $mdDialog.show({
                    scope:$scope.$new(),
                    template:'<send-message-modal lister="msg.listRef"></send-message-modal>',
                    clickOutsideToClose:true
                });
            };
        }
    }
}]);