var myApp = angular.module("messages", ['firebase','examinerDirectives']);
angular.module('messages')
  .filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });

myApp.controller("messagesController", ["$scope","$firebaseArray", "$firebaseObject","$filter", function($scope,$firebaseArray, $firebaseObject, $filter){
    
    var methods = Options();
    var user =  $firebaseObject(methods.userRef);
    var conversationsRef = methods.userRef.child("conversations");
    var allMessagesRef = methods.userRef.child("messages");
    $scope.conversationsList = $firebaseArray(conversationsRef);
    
    var a = $firebaseArray(conversationsRef);
    
    $scope.messagesList = $firebaseArray(allMessagesRef);
   
    var callFunctions = function(){
        makeToast();
        closeModal();
        switchMsgView();
        
        // these methods are for convoView
        // calls setUpViewModals() and setMessageStatus()
        showConvoModal(conversationsRef);
        // has $scope.initializeConvoView() inside and calls setConvoColor()
        initializeConvoView(); 
        // calls setConvoColor, changes the color of the convo based on its hasNewMsg status
        updateConvoStatus();
        
        //these are for messageView
        //call setUpViewModals()
        showMsgModal(allMessagesRef);
        // has $scope.checkIfOpened() inside 
        setMessageColor('blue');
    }
    
    var updateConvoStatus = function(){
        conversationsRef.on("value", function(datasnapshot){
            datasnapshot.forEach(function(childsnapshot){
               conversationsRef.child(childsnapshot.key()).on("value", function(){
                setConvoColor();
               }); 
            });
        });
    };
    
    var setConvoColor = function(){
            for(var i = 0 ; i<$scope.conversationsList.length; i++){
                    if($scope.conversationsList[i].hasNewMsg == true){
                        $(".table tbody tr")[i].style.backgroundColor = "blue" ;      
                    }else{
                        $(".table tbody tr")[i].style.backgroundColor = "white" ;  
                    };
               };
    }
    
    var makeToast = function(){
     conversationsRef.on("child_added", function (datasnapshot){
            $('.toast').fadeIn(400).delay(3000).fadeOut(400);
        });
    }
    
    var closeModal = function(){
         $("span.close").on("click", function(){
           $(".modal").removeClass("showing");
         });
    }
    
    var switchMsgView = function(){
        $("#switchView").on('click', function(){
           if($("#convoView").hasClass("hide")){          
               $("#msgView").addClass("hide"); 
               $("#convoView").removeClass("hide");
           }
            else if($("#msgView").hasClass("hide")){
                $("#convoView").addClass('hide');
                $("#msgView").removeClass("hide");
            }
        });
    }
    
        // sets up basic functionality for both messaging modals 
    var setUpViewModals = function(ref, selector, senderRef){
        $(selector).addClass('showing');
        $(".table tbody").on("click", 'tr',function(){
                $(this).css("background-color", "blue");                                                                   
        });
//        sendReply(senderRef);
    }
    

    
        // these methods are related to convo view
        // this is for changing all message status to true once the conversation has been opened to change the the tr color back to the original default
    var setMessageStatus = function(ref){
        ref.once("value",function(datasnapshot){
            datasnapshot.forEach(function(childsnapshot){
                console.log(childsnapshot.key());
                if(childsnapshot.key() != "lastReceivedMsg"){
                    console.log('h3llo');
                   ref.child(childsnapshot.key()).update({
                       opened:true 
                   });
                }
            });
        });
    };
    
    // this method here is changing the color of a tr with a conversation that has a message that has not been viewed
//    var setConvoColor = function(color, ref){
//        $scope.setConvoColor= function(convo){
//            ref.once("value",function(datasnapshot){
//               datasnapshot.forEach(function(childsnapshot){
//                  childsnapshot.forEach(function(child){
//                        if(child.val().opened == false){
//                          for(var i=0; i< $scope.conversationsList.length; i++){
//                              if(childsnapshot.key() == $scope.conversationsList[i].$id){
//                                  $(".table tbody tr")[i].style.backgroundColor = color;  
//                              }
//                          }
//                    }
//                  });
//               });
//            });
//        }
//    }
    
    
       var initializeConvoView = function(){
            $scope.initializeConvoView = function(){
            $scope.conversationsList = $filter('orderBy')($scope.conversationsList, '-lastReceivedMsg');
              setConvoColor();
            };
       };

    //this modal gets shown if user is in convo view
    var showConvoModal = function(ref){
        $scope.viewConvoMessages = function(convo){   
            ref.child(convo.$id + "/hasNewMsg").set(false);
            var senderRef = ref.child(convo.$id + "/messages");
            $scope.convoMessagesList = $firebaseArray(senderRef);
            document.getElementById("sender").textContent = convo.$id.toString();
            setMessageStatus(senderRef);
            setUpViewModals(ref, "#detailsModal", senderRef);
        }
    }
    
    //these methods are related to the single message ivew
    // this modal gets shown if user is in single message view
    var showMsgModal = function(ref){
        $scope.viewMessageDetails = function(msg){
            console.log(msg.sender);
            var senderRef = ref.child(msg.$id);
            $("#msgDetails").text(msg.body);
            setUpViewModals(ref,"#msgDetailsModal", msg, senderRef);
        }
    }
   
   // ng-init is running checkIfOpened function after all the messages have been loaded we are then calling the message status function on each table row and changing the color if it has been opened, the color we want to change it to is passed into message status();

    // gets the messages status and if it has not been opened changes the background color of that msg
    var setMessageColor = function(color){
        $scope.checkIfOpened = function(){
            for(var i=0; i< $scope.messagesList.length; i++){
                    if($scope.messagesList[i].opened == true){
                        $("tbody tr")[i].style.backgroundColor =color;
                    }
                }
        }
    } 
    
    callFunctions();
}]);



