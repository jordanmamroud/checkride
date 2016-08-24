var StudentFunctions = function(){
     var queryString = window.location.search ;
     var urlVar = queryString.substring(queryString.indexOf('=') + 1);
     
     var fun = { 
         
         getVarFromURL: function(){       
             var queryString = window.location.search
             var urlVar = queryString.substring(queryString.indexOf('=') + 1);
             return urlVar ;
         },
         
         sendMessageOnClick: function(selector, fireRef, sender){
            
                        $(selector).on("click", function(){
                            console.log(Date.now());
                            var convoRef = fireRef.child("conversations/" + sender);
                            var messageRef = fireRef.child("messages");
                            var msgObj = {
                                subject: $("#messageModal #messageSubject").val(),
                                body: $("#messageModal #messageBody").val(),
                                sender: sender,
                                order: Date.now(),
                                opened: false
                        }
                        convoRef.child("lastReceivedMsg").set(new Date(Date.now()).toString());
                        convoRef.child("hasNewMsg").set(true);
                        convoRef.child("messages").push(msgObj),
                        messageRef.push(msgObj);
                        $("#messageModal").css("display", "none");
                        });
         },
          
        sendTextOnClick: function(selector, dataObj){ 
                console.log('h2ll');
                // this sends a request to the server to send a text message to the examiners phone   
                $(selector).on("click", function(){
                        $.ajax({
                            type: "POST",
                            url: "https://blooming-river-27917.herokuapp.com/messages",
                            contentType:'application/json',
                            crossDomain: true,
                            dataType: "json",
                            data: JSON.stringify(dataObj)
                        }).done(function (dataObj) {
                            alert("ajax callback response:" + JSON.stringify(data));
                        });
                    });   
        },
          
          newWindowOnClick: function(clickId, url){
              $(clickId).on("click", function(){
                  window.location.href = url ;
              });
          },
          
          showModalOnClick: function(clickId, modalId){
               $(clickId).on("click", function () {  
                $(modalId).css("display","block");
                   console.log(new Date(Date.now()));
            }); 
          },

          closeModal: function(){
                $(".modal span.close").on("click", function(){
                    $(".modal").css("display", "none");
                });
          }      
      }
  return fun ;
};