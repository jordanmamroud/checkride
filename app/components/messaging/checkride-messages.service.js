(function(){

    angular.module('pcMessagesService',[])
    .factory('messagesService', messagesService)
    
        messagesService.$inject =  ['pcServices','$localStorage'];
    
        function messagesService(pcServices,$localStorage){
            var refs = pcServices.getCommonRefs() ;
     
            
            
            var service = {
  
                //functions
                
                createConvo:createConvo,
                deleteMessage: deleteMessage,
                Message:Message,
                msgRefs:msgRefs,
                sendReply:sendReply,
                setRecipientsList:setRecipientsList
            }
            
            return service ;
            
            function createConvo(userData, conversationData){
                var key = msgRefs().userConversationsRef.push().key;
                var newUserConversationRef = msgRefs().userConversationsRef.child(key);
                var recipientId = conversationData.recipient.$id ;
                var newRecipientConversationRef = refs.conversations.child(recipientId).child(key);
                var name = userData.name.first + " " + userData.name.last;
                var msgObj = new Message(conversationData.body, name);
                
                setUserAction();
                setRecipientAction();
                // inner function
                function setUserAction(){
                    newUserConversationRef.child("messages").push(msgObj);
                    newUserConversationRef.update({
                        users:{name:conversationData.recipient.name, id: recipientId},
                        lastMsg: new Date()     
                    });
                }
                //inner function
                function setRecipientAction(){
                    newRecipientConversationRef.child("messages").push(msgObj);
                    newRecipientConversationRef.update({ 
                        lastMsg:new Date(Date.now()).toString(),
                        hasNewMsg: true,
                        users:{name: userData.name.first + " " + userData.name.last, id:userData.$id}
                    })
                    var notification = {
                        sentAt: new Date().toString(),
                        name: userData.name.first +" " + userData.name.last,
                        photoUrl: userData.photoUrl
                    }
                    refs.notifications.child(recipientId).push(notification);
                }
            }
            
            function deleteMessage(conversationId, messageId){
                msgRefs().userConversationsRef.child(conversationId + "/messages").child(messageId).remove();
            }
            
            function Message(body,sender){
                this.body = body;
                this.sender = sender;
                this.sentAt = new Date(); ;
            }
            
            function msgRefs(){
                
               var userConversationsRef = pcServices.getCommonRefs().userConversations;
                console.log(userConversationsRef.toString());
               return {
                   userRef: pcServices.getCommonRefs().user,
                   userConversationsRef: userConversationsRef
               }
            }

            function sendReply(user, convoInfo, msgObj){
                var recipientRef = refs.conversations.child(convoInfo.users.id) ;
                recipientRef.child(convoInfo.$id + "/messages").push(msgObj) ;
                msgRefs().userConversationsRef.child(convoInfo.$id +"/messages").push(msgObj) ;
                recipientRef.child(convoInfo.$id).update({
                    lastReceivedMsg:new Date(Date.now()).toString(),
                    hasNewMsg: true
                });
               var notification = {
                    sentAt: new Date().toString(),
                    name: user.name.first +" " + user.name.last,
                    photoUrl: user.photoUrl
                }
                refs.notifications.child(convoInfo.users.id).push(notification) ;
            }

            function setRecipientsList(userInfo){
                console.log(userInfo);
                if(userInfo.role.toLowerCase() == "examiner"){
                    return pcServices.createFireArray(refs.students);
                };
                if(userInfo.role.toLowerCase() == "student"){
                    return pcServices.createFireArray(refs.examiners);
                };
            }
        }
    }())