angular.module("messages", ['firebase', 'commonServices', 'ngMaterial'])

<<<<<<< HEAD
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
=======
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
>>>>>>> d5540d4151166988c4cf6b5be7c06cdb6ee44e94
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
<<<<<<< HEAD
            //functions that are being called
=======
>>>>>>> d5540d4151166988c4cf6b5be7c06cdb6ee44e94
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
<<<<<<< HEAD
                console.log(this.convoMessages);
                this.convoInfo = convo ;
=======
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
>>>>>>> d5540d4151166988c4cf6b5be7c06cdb6ee44e94
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
<<<<<<< HEAD
            
            function createSendMsgDialog(){
=======
          
            this.op = function(){
>>>>>>> d5540d4151166988c4cf6b5be7c06cdb6ee44e94
                $mdDialog.show({
                    scope:$scope.$new(),
                    template:'<send-message-modal lister="msg.listRef"></send-message-modal>',
                    clickOutsideToClose:true
                });
            };
        }
    }
}]);