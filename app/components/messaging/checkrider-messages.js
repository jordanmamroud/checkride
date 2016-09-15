angular.module("messages", ['firebase', 'commonServices', 'ngMaterial'])

.service('messagesService', ['commonServices',function(commonServices){
    return{
        sendMessage:function(userData, recipientData, msgObj){
            var refs = commonServices.getCommonRefs();
            var userRef = refs.accounts.child(userData.$id);
            var recipientRef = refs.accounts.child(recipientData.$id);
            var conversationsRef = userRef.child("conversations");
            var convos = refs.conversations.push().child('messages').push(msgObj);
            refs.conversations.child(convos.key() +'/users').child(userData.$id).set({
                name:userData.firstName+" "+userData.lastName
            });
            refs.conversations.child(convos.key()+'/users').child(userData.$id).set({
                name:recipientData.firstName+" " + recipientData.lastName
            });
            console.log(recipientData);
            conversationsRef.child(convos.key()).set({
                lastReceivedMsg:new Date(Date.now()).toString(),
                hasNewMsg: true,
                users:recipientData.name
            })
            recipientRef.child("conversations/"+ convos.key()).set({
                lastReceivedMsg:new Date(Date.now()).toString(),
                hasNewMsg: true,
                users:userData.firstName+ " " +userData.lastName
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
                var refs = commonServices.getCommonRefs();
                if(userInfo.userType.toLowerCase() == "examiner"){
                    this.recipientsList = commonServices.createFireArray(refs.students)
                };
                if(userInfo.userType.toLowerCase() == "student"){
                    this.recipientsList = commonServices.createFireArray(refs.examiners);
                };
                this.recipient = '';          
                this.sendMessage = function(){
                    console.log(this.recipient);
                    var msgObj = {
                            body: this.body,
                            sender: userInfo.firstName + " " + userInfo.lastName,
                            order: Date.now(),
                            opened: false,
                            key:"janeyahoocom"
                    }
                    messagesService.sendMessage(userInfo, JSON.parse(this.recipient), msgObj);
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
            var arr = [];
            this.convoMessages = $scope.$resolve.conversations[$scope.$resolve.conversations.length-1].messages;
            this.convoInfo = $scope.$resolve.conversations[$scope.$resolve.conversations.length-1];
            this.view = false ;
            this.convo ='';
            //functions that are being called
            commonServices.showToastOnEvent(conversationsRef, "child_added");
            setRecipientsList();
            this.viewConvoMessages = viewConvoMessages ;
            this.sendReply = sendReply;
            this.op = createSendMsgDialog;
            
            
            for(a of cool){
                console.log(a);
            };
            
            function viewConvoMessages(convo){
                conversationsRef.child(convo.$id).child("hasNewMsg").set(false);
                console.log(convo)
                var messagesRef = refs.conversations.child(convo.$id + "/messages");
                this.convoMessages= $firebaseArray(messagesRef);
                console.log(this.convoMessages);
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
                    messagesService.sendMessage(userInfo, this.convoInfo, msgObj);
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