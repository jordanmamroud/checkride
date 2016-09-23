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
    self.convoMessages = [];
	self.conversationsList = pcServices.createFireArray(conversationsRef);
	self.convoInfo = conversations[conversations.length-1]; 
	self.sendReply = sendReply;
	self.openConvoDialog = createSendMsgDialog;
	self.viewConvoMessages = viewConvoMessages;
    
    
    conversationsRef.on('child_added', function(data){
        self.convoMessages = pcServices.createFireArray(conversationsRef.child(data.key() + "/messages"));
        console.log(data.key());
    })
    
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
		var msgObj = new messagesService.Message(self.body, userInfo.name.first +" " + userInfo.name.last);
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

	function Message(body,sender){
		this.body = body;
		this.sender = sender;
		this.sentAt = Firebase.ServerValue.TIMESTAMP ;

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
        console.log(msgObj)
	}

	function setRecipientsList(userInfo){
		if(userInfo.role.toLowerCase() == "examiner"){
			return pcServices.createFireArray(refs.students);

		};
		if(userInfo.role.toLowerCase() == "student"){
			return pcServices.createFireArray(refs.examiners);
		};
	}
	
	return service ;
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

		controller:function($scope){
            var userInfo = $scope.$parent.$resolve.user ;
			this.recipientsList = messagesService.setRecipientsList(userInfo);
			this.recipient = '';          
			this.sendMessage = sendMessage ;

			function sendMessage(){
				var name = userInfo.name.first + " " + userInfo.name.last;
				var message = new messagesService.Message(this.body, name);
				messagesService.createConvo(userInfo, JSON.parse(this.recipient) , message);
			}
		}
	}
}


function messagesDirective(messagesService, pcServices,user,$mdDialog){
	return{
		templateUrl: function(){
			 return "app/components/messaging/messages.html?" + new Date();
		},
		controller:'messagesController'
	}
}


//.controller('messagesController',['$scope','messagesService','pcServices','conversations','$mdDialog', function($scope,messagesService, pcServices, conversations, $mdDialog){
//	var vm = this;
//	var refs = pcServices.getCommonRefs();
//	var userInfo = pcServices.getCookieObj('user');
//	var userRef = refs.accounts.child(userInfo.$id);
//	var conversationsRef = refs.conversations.child(userInfo.$id);
//	
//    vm.delete = function(mesg){
//       conversationsRef.child(vm.convoInfo.$id+ "/messages").child(mesg.$id).remove();
//    }
//	vm.conversationsList = pcServices.createFireArray(conversationsRef);
//	vm.convoInfo = conversations[conversations.length-1]; 
//	if(vm.convoInfo != undefined){
//		vm.convoMessages = pcServices.createFireArray(conversationsRef.child(vm.convoInfo.$id+ "/messages")); 
//	}
//	vm.view = false ;
//	vm.convo ='';    
//	pcServices.showToastOnEvent(conversationsRef, "child_added");
//    
//	vm.sendReply = sendReply;
//	vm.openConvoDialog = createSendMsgDialog;
//	vm.viewConvoMessages = viewConvoMessages;
//	
//	function viewConvoMessages(convo){
//		var messagesRef = refs.conversations.child(userInfo.$id +"/" + convo.$id +"/messages")
//		conversationsRef.child(convo.$id).child("hasNewMsg").set(false);
//		vm.convoInfo = convo ;
//		vm.convoMessages = pcServices.createFireArray(messagesRef);
//	};
//    
//	function sendReply(cv){
//		var msgObj = new messagesService.Message(vm.body, userInfo.name.first +" " +userInfo.name.last);
//		messagesService.sendReply(userInfo,vm.convoInfo, msgObj);
//	};  
//    
//	function createSendMsgDialog(){
//		$mdDialog.show({
//			scope:$scope.$new(),
//			template:'<send-message-modal lister="msg.listRef"></send-message-modal>',
//			clickOutsideToClose:true
//		});
//	};
//}])
//
//
//function messageCtrl($scope,messagesService, pcServices, conversations,user, $mdDialog){
//	var vm = this;
//	var refs = pcServices.getCommonRefs();
//	var userInfo = pcServices.getCookieObj('user');
//	var userRef = refs.accounts.child(userInfo.$id);
//	var conversationsRef = refs.conversations.child(userInfo.$id);
//	
//    vm.delete = function(mesg){
//       conversationsRef.child(vm.convoInfo.$id+ "/messages").child(mesg.$id).remove();
//    }
//	vm.conversationsList = pcServices.createFireArray(conversationsRef);
//	vm.convoInfo = conversations[conversations.length-1]; 
//	if(vm.convoInfo != undefined){
//		vm.convoMessages = pcServices.createFireArray(conversationsRef.child(vm.convoInfo.$id+ "/messages")); 
//	}
//	vm.view = false ;
//	vm.convo ='';    
//	pcServices.showToastOnEvent(conversationsRef, "child_added");
//    
//	vm.sendReply = sendReply;
//	vm.openConvoDialog = createSendMsgDialog;
//	vm.viewConvoMessages = viewConvoMessages;
//	
//	function viewConvoMessages(convo){
//		var messagesRef = refs.conversations.child(userInfo.$id +"/" + convo.$id +"/messages")
//		conversationsRef.child(convo.$id).child("hasNewMsg").set(false);
//		vm.convoInfo = convo ;
//		vm.convoMessages = pcServices.createFireArray(messagesRef);
//	};
//    
//	function sendReply(cv){
//		var msgObj = new messagesService.Message(vm.body, userInfo.name.first +" " +userInfo.name.last);
//		messagesService.sendReply(userInfo,vm.convoInfo, msgObj);
//	};  
//    
//	function createSendMsgDialog(){
//		$mdDialog.show({
//			scope:$scope.$new(),
//            template:'hey',
//			template:'<send-message-modal lister="msg.listRef"></send-message-modal>',
//			clickOutsideToClose:true
//		});
//	};
//}
//
//
