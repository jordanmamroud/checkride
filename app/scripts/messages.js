var myApp = angular.module("messages", ['firebase', 'examinerDirectives', 'commonServices']);

angular.module('messages')
  .filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });

myApp.service('messagesService', [function(){
    return{
//        attachConvoListener: function(ref, setTrColor){
//            ref.on("value", function(datasnapshot){
//                datasnapshot.forEach(function(childsnapshot){
//                   ref.child(childsnapshot.key()).on("value", function(){
//                        setTrColor();
//            });
//        },
//        setTrColor: function(list){
//            for(var i = 0 ; i<list.length; i++){
//                    if(list[i].hasNewMsg == true){
//                        $(".table tbody tr")[i].style.backgroundColor = "blue" ;      
//                    }else{
//                        $(".table tbody tr")[i].style.backgroundColor = "white" ;  
//                    };
//               };
//        },
//        
        sendMessage:function(fireRef, sender){
                        var convoRef = fireRef.child("conversations/" + sender);
                        var messageRef = fireRef.child("messages");
                        var msgObj = {
                                subject:"hame",
                                body: "vans",
                                sender: "sender",
                                order: Date.now(),
                                opened: false,
                                key:"janeyahoocom"
                        }
                        convoRef.child("lastReceivedMsg").set(new Date(Date.now()).toString());
                        convoRef.child("hasNewMsg").set(true);
                        convoRef.child("messages").push(msgObj),
                        messageRef.push(msgObj);  
        }
    }
}]);
myApp.directive("sendMessageModal", ['messagesService',function(messagesService){
    return{
        templateUrl:"app/shared/templates/directiveTemplates/sendMessageModal.html",
        scope:{
            sendTo:"=",
            sender:"=",
            modalId:"@"  
        },
        link:function(scope,element,attrs,$scope){
             attrs.$observe("sender", function(sender){
                console.log(sender)
             })
        },
        controller:function($scope){
            console.log($scope);
            var sendToRef = new Firebase("https://checkride.firebaseio.com/users/"+ $scope.sendTo);
            $scope.sendMessage = function(){
                messagesService.sendMessage(sendToRef, $scope.sender);
            }
        }
    }
}]);

myApp.directive("messagesDirective",["$firebaseArray", "$firebaseObject","$filter", 'messagesService',"commonServices",function($firebaseArray, $firebaseObject, $filter, messagesService, commonServices){
    return{
        templateUrl: "app/shared/templates/directiveTemplates/messages.html",
        controller:function($scope){
            var userListRef = new Firebase("https://checkride.firebaseio.com/users");
            var authData = userListRef.getAuth();
            var userId = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');
            var userRef = userListRef.child(userId);
            var user =  $firebaseObject(userRef);
            var conversationsRef = userRef.child("conversations");
            var allMessagesRef = userRef.child("messages");
            var convoRef = conversationsRef.child('fabs');
            
            $scope.conversationsList = $firebaseArray(conversationsRef);
            $scope.messagesList = $firebaseArray(allMessagesRef);
            $scope.view = false ;
            commonServices.showToastOnEvent(conversationsRef, "child_added");
            console.log('ham');
            var setMessageStatus = function(ref){
                ref.once("value",function(datasnapshot){
                    datasnapshot.forEach(function(childsnapshot){
                        console.log(childsnapshot.key());
                        if(childsnapshot.key() != "lastReceivedMsg"){

                           ref.child(childsnapshot.key()).update({
                               opened:true 
                           });
                        }
                    });
                });
            };

            $scope.initializeConvoView = function(){
                $scope.conversationsList = $filter('orderBy')($scope.conversationsList, '-lastReceivedMsg');
            };

            $scope.viewConvoMessages = function(convo){   
                conversationsRef.child(convo.$id + "/hasNewMsg").set(false);
                var senderRef = conversationsRef.child(convo.$id + "/messages");
                $scope.convoMessagesList = $firebaseArray(senderRef);
                $scope.convo = convo.$id.toString();
                setMessageStatus(senderRef);
            }

            $scope.viewMessageDetails = function(msg){
                $scope.sender = msg.sender ;
                $scope.message = msg.body ;
                $scope.senderRef = msg.key;
                console.log(msg.sender);
                allMessagesRef.child(msg.$id).update({opened: true});
            }


            $scope.sendMessage = function(){
                var senderRef = userListRef.child($scope.senderRef);
                messagesService.sendMessage(senderRef,$scope.sender );
            }
        }
    }
}]);
//
//("messagesController", ["$scope","$firebaseArray", "$firebaseObject","$filter", 'messagesService',"commonServices",function($scope,$firebaseArray, $firebaseObject, $filter, messagesService, commonServices){
//    var userListRef = new Firebase("https://checkride.firebaseio.com/users");
//    var authData = userListRef.getAuth();
//    var userId = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');
//    var userRef = userListRef.child(userId);
//    var user =  $firebaseObject(userRef);
//    var conversationsRef = userRef.child("conversations");
//    var allMessagesRef = userRef.child("messages");
//    var convoRef = conversationsRef.child('fabs');
//    $scope.conversationsList = $firebaseArray(conversationsRef);
//    $scope.messagesList = $firebaseArray(allMessagesRef);
//    $scope.view = false ;
//
//    var setColor = function(){
//        messagesService.setTrColor($scope.conversationsList);
//    }
//    
//    messagesService.attachConvoListener(conversationsRef, setColor);
//    
//    commonServices.showToastOnEvent(conversationsRef, "child_added");
//       var msgObj = {
//                        subject: 'bange',
//                        body: 'bam',
//                        sender: 'sender',
//                        order: Date.now(),
//                        opened: false,
//                        key:'janeyahoocom'
//                        }
//                        convoRef.child("lastReceivedMsg").set(new Date(Date.now()).toString());
//                        convoRef.child("hasNewMsg").set(true);
//                        convoRef.child("messages").push(msgObj);
//                        allMessagesRef.push(msgObj);
//
//
//        var setUpViewModals = function(selector){
//            $(selector).addClass('showing');
//        }
//
//        var setMessageStatus = function(ref){
//            ref.once("value",function(datasnapshot){
//                datasnapshot.forEach(function(childsnapshot){
//                    console.log(childsnapshot.key());
//                    if(childsnapshot.key() != "lastReceivedMsg"){
//
//                       ref.child(childsnapshot.key()).update({
//                           opened:true 
//                       });
//                    }
//                });
//            });
//        };
//       
//        $scope.initializeConvoView = function(){
//        $scope.conversationsList = $filter('orderBy')($scope.conversationsList, '-lastReceivedMsg');
//          setColor();
//        };
//    
//        $scope.viewConvoMessages = function(convo){   
//            conversationsRef.child(convo.$id + "/hasNewMsg").set(false);
//            var senderRef = conversationsRef.child(convo.$id + "/messages");
//            $scope.convoMessagesList = $firebaseArray(senderRef);
//            $scope.convo = convo.$id.toString();
//            setMessageStatus(senderRef);
//            setUpViewModals("#detailsModal");
//        }
//  
//        $scope.viewMessageDetails = function(msg){
//            $scope.sender = msg.sender ;
//            $scope.message = msg.body ;
//            $scope.senderRef = msg.key;
//            console.log(msg.sender);
//            allMessagesRef.child(msg.$id).update({opened: true});
//            setUpViewModals("#msgDetailsModal");
//        }
//        
//        $scope.checkIfOpened = function(){
//            for(var i=0; i< $scope.messagesList.length; i++){
//                    if($scope.messagesList[i].opened == false){
//                        $("#msgView tbody tr")[i].style.backgroundColor = 'red';
//                    }
//                }
//        }
//        
//        $scope.sendMessage = function(){
//            var senderRef = userListRef.child($scope.senderRef);
//            messagesService.sendMessage(senderRef,$scope.sender );
//        }
//}]);

//myApp.controller("messagesController", ["$scope","$firebaseArray", "$firebaseObject","$filter", 'messagesService',"commonServices",function($scope,$firebaseArray, $firebaseObject, $filter, messagesService, commonServices){
//    var userListRef = new Firebase("https://checkride.firebaseio.com/users");
//    var authData = userListRef.getAuth();
//    var userId = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');
//    var userRef = userListRef.child(userId);
//    var user =  $firebaseObject(userRef);
//    var conversationsRef = userRef.child("conversations");
//    var allMessagesRef = userRef.child("messages");
//    var convoRef = conversationsRef.child('fabs');
//    $scope.conversationsList = $firebaseArray(conversationsRef);
//    $scope.messagesList = $firebaseArray(allMessagesRef);
//    $scope.view = false ;
//
//    var setColor = function(){
//        messagesService.setTrColor($scope.conversationsList);
//    }
//    
//    messagesService.attachConvoListener(conversationsRef, setColor);
//    
//    commonServices.showToastOnEvent(conversationsRef, "child_added");
//
//       var msgObj = {
//                        subject: 'bange',
//                        body: 'bam',
//                        sender: 'sender',
//                        order: Date.now(),
//                        opened: false,
//                        key:'janeyahoocom'
//                        }
//                        convoRef.child("lastReceivedMsg").set(new Date(Date.now()).toString());
//                        convoRef.child("hasNewMsg").set(true);
//                        convoRef.child("messages").push(msgObj);
//                        allMessagesRef.push(msgObj);
//
//
//        var setUpViewModals = function(selector){
//            $(selector).addClass('showing');
//        }
//
//        var setMessageStatus = function(ref){
//            ref.once("value",function(datasnapshot){
//                datasnapshot.forEach(function(childsnapshot){
//                    console.log(childsnapshot.key());
//                    if(childsnapshot.key() != "lastReceivedMsg"){
//
//                       ref.child(childsnapshot.key()).update({
//                           opened:true 
//                       });
//                    }
//                });
//            });
//        };
//       
//        $scope.initializeConvoView = function(){
//        $scope.conversationsList = $filter('orderBy')($scope.conversationsList, '-lastReceivedMsg');
//          setColor();
//        };
//    
//        $scope.viewConvoMessages = function(convo){   
//            conversationsRef.child(convo.$id + "/hasNewMsg").set(false);
//            var senderRef = conversationsRef.child(convo.$id + "/messages");
//            $scope.convoMessagesList = $firebaseArray(senderRef);
//            $scope.convo = convo.$id.toString();
//            setMessageStatus(senderRef);
//            setUpViewModals("#detailsModal");
//        }
//  
//        $scope.viewMessageDetails = function(msg){
//            $scope.sender = msg.sender ;
//            $scope.message = msg.body ;
//            $scope.senderRef = msg.key;
//            console.log(msg.sender);
//            allMessagesRef.child(msg.$id).update({opened: true});
//            setUpViewModals("#msgDetailsModal");
//        }
//    
//        $scope.checkIfOpened = function(){
//            for(var i=0; i< $scope.messagesList.length; i++){
//                    if($scope.messagesList[i].opened == false){
//                        $("#msgView tbody tr")[i].style.backgroundColor = 'red';
//                    }
//                }
//        }
//        
//        $scope.sendMessage = function(){
//            var senderRef = userListRef.child($scope.senderRef);
//            messagesService.sendMessage(senderRef,$scope.sender );
//        }
//     
//
//}]);

// fix  color change of tr when i open msg view msg 



//      var msgObj = {
//                                subject: 'bange',
//                                body: 'bam',
//                                sender: 'sender',
//                                order: Date.now(),
//                                opened: false
//                        }
//                        convoRef.child("lastReceivedMsg").set(new Date(Date.now()).toString());
//                        convoRef.child("hasNewMsg").set(true);
//                        convoRef.child("messages").push(msgObj);
//    allMessagesRef.push(msgObj);
