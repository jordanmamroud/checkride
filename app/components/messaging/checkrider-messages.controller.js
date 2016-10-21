(function(){
    
    angular.module('pcMessagesController',[])
    .controller('messagesController',messagesCtrl)

    messagesCtrl.$inject = ['$scope','messagesService','pcServices','$mdDialog'];
    
    function messagesCtrl($scope,messagesService, pcServices,$mdDialog){
        var refs = pcServices.getCommonRefs();
        var self = this;
        
	    var conversationsRef = refs.userConversations;
        
        
          self.viewingMessages = false
        // scope variables
        self.currentConversation  ;
        self.conversationMessages =[];
        self.conversationsList = pcServices.createFireArray(conversationsRef) ;
        self.newConversation = {recipient:null, body:null};
        self.recipientsList= 'no recipients';
        self.recipient = {name: null}; 
	    self.user = pcServices.createFireObj(refs.user); 
        
    
        
        //scope functions
        self.deleteMessage = deleteMessage
        self.setNewConversationDialog = setNewConversationDialog;
        self.createConvo = createConvo ;
        self.sendReply = sendReply;
        self.viewConvoMessages = viewConvoMessages;
        
        self.conversationsList.$loaded().then(function(){
            self.currentConversation = self.conversationsList[0];
            if(self.currentConversation){
                self.conversationMessages = pcServices.createFireArray(conversationsRef.child(self.currentConversation.$id + "/messages")); 
            }
        })
        
        function deleteMessage(message){ 
            messagesService.deleteMessage(self.currentConversation.$id, message.$id); 
        }
    
        function createConvo(){
            messagesService.createConvo(self.user, self.newConversation);
        }
        
        function viewConvoMessages(convo){
            var currentConvoMessages = conversationsRef.child(convo.$id +"/messages");
            conversationsRef.child(convo.$id).child("hasNewMsg").set(false);
            self.currentConversation = convo ;
            self.conversationMessages = pcServices.createFireArray(currentConvoMessages);
            self.viewingMessages = true
        };

        function sendReply(){
            var msgObj = new messagesService.Message(self.body, self.user.name.first +" " + self.user.name.last);
            messagesService.sendReply(self.user, self.currentConversation , msgObj) ;
        };  

        function setNewConversationDialog(){
            self.recipientsList = messagesService.setRecipientsList(self.user);
            $mdDialog.show({
                scope:$scope.$new(),
                templateUrl:"sendMessageModal",
                clickOutsideToClose:true
            });
        };
        pcServices.showToastOnEvent(conversationsRef, "child_added");
    }
    
}())