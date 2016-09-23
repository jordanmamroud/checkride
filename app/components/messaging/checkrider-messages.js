angular.module("messages", ['firebase', 'pcServices', 'ngMaterial'])
.controller('messagesController',['$scope','messagesService','pcServices','conversations',"user",'$mdDialog', messageCtrl])
.service('messagesService', ['pcServices', messageService])
.directive("sendMessageModal", ['messagesService', 'pcServices', sendMessageModal])
.directive("messagesDirective", ['messagesService',"pcServices",'$mdDialog', messagesDirective])


function messageCtrl($scope,messagesService, pcServices, conversations, user,$mdDialog){
	var self = this;
	var refs = pcServices.getCommonRefs();
	var userInfo = user;
	self.user = user; 

	self.userName = self.user.name.first + " " + self.user.name.last; 
	var userRef = refs.accounts.child(userInfo.$id);
	var conversationsRef = refs.conversations.child(userInfo.$id);
	self.view = false ;
	self.convo ='';    
	self.conversationsList = pcServices.createFireArray(conversationsRef);
	self.convoInfo = conversations[conversations.length-1]; 
	self.sendReply = sendReply;
	self.openConvoDialog = createSendMsgDialog;
	self.viewConvoMessages = viewConvoMessages;


    self.delete = function(mesg){
       conversationsRef.child(self.convoInfo.$id+ "/messages").child(mesg.$id).remove();
    }

	if(self.convoInfo != undefined){
		self.convoMessages = pcServices.createFireArray(conversationsRef.child(self.convoInfo.$id+ "/messages")); 
	}

	pcServices.showToastOnEvent(conversationsRef, "child_added");
   
	
	function viewConvoMessages(convo){
		var messagesRef = refs.conversations.child(userInfo.$id +"/" + convo.$id +"/messages")
		conversationsRef.child(convo.$id).child("hasNewMsg").set(false);
		self.convoInfo = convo ;
		self.convoMessages = pcServices.createFireArray(messagesRef);
	};
    
	function sendReply(){
		var msgObj = new messagesService.Message(self.body, userInfo.name.first +" " +userInfo.name.last, new Date());
		console.log(this.convoInfo);
		messagesService.sendReply(userInfo,self.convoInfo, msgObj);
	};  
    
	function createSendMsgDialog(){
		$mdDialog.show({
			scope:$scope.$new(),
			template:'<send-message-modal lister="msg.listRef"></send-message-modal>',
			clickOutsideToClose:true
		});
	};
}

function messageService(pcServices){
	var refs = pcServices.getCommonRefs();
	var service = {
			Message:Message,
			createConvo:createConvo,
			sendReply:sendReply,
			setRecipientsList:setRecipientsList
	}
	return service ;

	function Message(body,sender, sentAt){
		this.body = body;
		this.sender = sender;
		this.sentAt = sentAt ;
	}

	function createConvo(userData, recipientData, msgObj){
		var userRef = refs.accounts.child(userData.$id);
		var convoKey = userRef.push().key();
		var userConvo = refs.conversations.child(userData.$id).child(convoKey);
		var recipientConvo = refs.conversations.child(recipientData.$id).child(convoKey);
		userConvo.child("messages").push(msgObj);
		userConvo.update({
			users:{name:recipientData.name, id:recipientData.$id},
			lastMsg: new Date()    
		})
		recipientConvo.child("messages").push(msgObj);
		recipientConvo.update({ 
			lastMsg:new Date(Date.now()).toString(),
			hasNewMsg: true,
			users:{name: userData.name.first + " " + userData.name.last, id:userData.$id}
		})
        pcServices.getCommonRefs().notifications.child(recipientData.$id).push("New message From " + userData.name.first + 
        " "+userData.name.last );
	}

	function sendReply(user,convoInfo, msgObj){
		var userConvosRef = refs.conversations.child(user.$id);
		var recipientRef = refs.conversations.child(convoInfo.users.id);
		recipientRef.child(convoInfo.$id+ "/messages").push(msgObj);
		userConvosRef.child(convoInfo.$id +"/messages").push(msgObj);
		recipientRef.child(convoInfo.$id).update({
			lastReceivedMsg:new Date(Date.now()).toString(),
			hasNewMsg: true
		});
        pcServices.getCommonRefs().notifications.child(convoInfo.users.id).push("New message From " + user.name.first + 
        " "+user.name.last );
	}

	function setRecipientsList(userInfo){
		if(userInfo.role.toLowerCase() == "examiner"){
			return pcServices.createFireArray(refs.students);

		};
		if(userInfo.role.toLowerCase() == "student"){
			return pcServices.createFireArray(refs.examiners);
		};
	}
}



function sendMessageModal(messagesService, pcServices){
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

		controller:function(){
			
			this.recipientsList = messagesService.setRecipientsList(userInfo);
			this.recipient = '';          
			this.sendMessage = sendMessage ;

			function sendMessage(){
				var name = userInfo.name.first + " " + userInfo.name.last;
				var message = new messagesService.Message(this.body, name, new Date());
				messagesService.createConvo(userInfo, JSON.parse(this.recipient) , message);
			}
		}
	}
}


function messagesDirective(messagesService, pcServices,$mdDialog){
	return{
		templateUrl: function(){
			 return "app/components/messaging/messages.html?" + new Date();
		},
		controller:'messagesController'
	}
}



