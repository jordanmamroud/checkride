//var app = angular.module('log', []);

app.service('loginService', ["$firebaseObject", "$location",function($firebaseObject,$location){
    var usersRef  = new Firebase("https://checkride.firebaseio.com/users/");
    var auth = usersRef.getAuth();
    
    return{
        signIn: function(email, pass, fireData){
                console.log('bane');
                usersRef.authWithPassword({
                email: email ,
                password: pass
            },
            function(error, authData){
                if(error){
                    alert("login failed");
                } 
                else{
                           var user = usersRef.child(email.replace(/[\*\^\.\'\!\@\$]/g , ''));
                           var userInfo = $firebaseObject(user);
                           userInfo.$loaded().then(function(){
                                switch(userInfo.userData.userType.toLowerCase()){
                                    case "examiner":
                                          $location.path('/examiner');
                                        
                                        break;

                                    case "student":
                                         $location.path("StudentFiles/examinerList.html")
                                        break;
                                }
                            });
                    }
                }); 
        },
        
        sendNewPassWord: function(){
               usersRef.resetPassword({
                      email: $("#email").val()
                            }, 
                      function(error) {
                          if (error) {
                            switch (error.code) {
                              case "INVALID_USER":
                                alert("The account does not exist");
                                break;
                              default:
                                console.log("Error resetting password:", error);
                            }
                          } else {
                            console.log("Password reset email sent successfully!");
                          }
                });
        }
    }
}]);

app.service("commonServices", ["$location",'$timeout', function($location, $timeout){
    return{
        
        changeLocationOnClick: function(selector, urlString){
            $(selector).on("click",function(){
                 $timeout(function(){
                     $location.path("/createAccount")
                },1);
            });
        },
        
        orderArray: function(list, orderBy){
            list = $filter('orderBy')(list, orderBy);
        },
        
        showToastOnEvent: function(ref,child,event){
            ref.child(child).on(event, function (datasnapshot){
                                $('.toast').fadeIn(400).delay(3000).fadeOut(400);
            });
        },
        
        setDataField: function(fireData, selector){
            fireData.$loaded().then(function(){
               $(selector).text(fireData.userData.firstName + " " + fireData.userData.lastName); 
            });
        }
        
    }
}]);

//app.service("calendarService", [function(){
//       // constructor for the users calendar settings called in saveCalSettings function
//        var CalSettings = function (minTime, maxTime, googleCalendarId, synced) {
//            this.minTime = minTime;
//            this.maxTime = maxTime
//            this.googleCalendarId = googleCalendarId ;
//            this.synced = synced;
//        }
//        
//        var eventCreate = {
//                createRegularEvent: function(start, end, eventId, ref){         
//                    var eventObj ={
//                                        title:$("#eventInput").val(),
//                                        recur:"once",
//                                        start:start.toISOString(),
//                                        end: end.toISOString(),
//                                        id: eventId.replace(/[\s+\*\^\.\'\!\@\:\-\$]/g, '').toLowerCase(),
//                                        eventType:"regular event"
//                                   }
//                    ref.push(eventObj);   
//                },
//        
//               createRecurringEvent: function(start, end,eventId,ref){
//                    switch($("#freq").val().toLowerCase()){   
//                        case "daily":  
//                                recurringEventMethods(start,end,eventId,ref).createDailyEvent();
//                                break;
//
//                        case "weekly":
//                                recurringEventMethods(start,end,eventId,ref).createWeeklyEvent();
//                                break;
//
//                        case "monthly": 
//                                recurringEventMethods(start, end, eventId,ref).createMonthlyEvent();
//                                break;
//                    };
//               }       
//            }
//        
//        
//        var deleteEvents = {
//             deleteMonthlyEvent:function(event, ref){
//                        $('#deleteMonthlyEvent').removeClass("hide");
//                        $("#oneEvent").on("click", function(){
//                           var eventToDelete = ref.child(event.$id) ;
//                           eventToDelete.remove();
//                           
//                        });
//                        $("#allEvents").on("click",function(){
//                            ref.once("value", function(datasnapshot){
//                                datasnapshot.forEach(function(childsnapshot){
//                                    if(childsnapshot.val().title == event.title){
//                                        ref.child(childsnapshot.key()).remove();
//                                    }
//                                });
//                            });
//                        });
//                    },
//             removeEvent: function(event, ref){
//                   var eventToDelete = ref.child(event.$id) ;
//                   eventToDelete.remove();
//
////                   $("#eventDetailsModal").removeClass("showing");
//                },
//            
//             deleteEvent: function(event, ref, selector){
//                $(selector).on("click", function () {
//                    if(event.recur == "monthly"){
//                        deleteEvents.deleteMonthlyEvent(event,ref)
//                    }
//                    else{
//                        deleteEvents.removeEvent(event, ref);
//                   }
//                });
//            }
//        }
//        
//        
//        var updateEvents = function(event, ref){
//        return{
//             updateSingleEvent: function(){
//             ref.child(event.$id).update({
//                        title: event.title,
//                        start: event.start.toISOString(),
//                        end: event.end.toISOString(),
//                        id: event.title + event.start.toISOString() + event.end.toISOString()
//                    }); 
//             },
//             
//             updateWeeklyEvent: function(){
//                              var clientEvents = $("#cal").fullCalendar("clientEvents");
//                              if(event.dow.length > 1){
//                                    ref.child(event.$id).update({
//                                            start: event.start.toString().substring(16,24),
//                                            end: event.end.toString().substring(16,24),
//                                            id: event.title + event.start.toString() + event.end.toString()
//                                    });
//                              }else{
//                                   ref.child(event.$id).update({
//                                            dow:event.start.day(),
//                                            start: event.start.toString().substring(16,24),
//                                            end: event.end.toString().substring(16,24),
//                                            id: event.title + event.start.toString() + event.end.toString()
//                                    });
//                              }
//                        },
//            updateMonthlyEvent: function(){
//                        //reminder properbel is _i is original time not new event time , look at event itself more
//                        ref.once("value", function(datasnapshot){
//                            datasnapshot.forEach(function(childsnapshot){
//                                if(childsnapshot.val().title == event.title){
//                                    var nsHour = event.start.toString().substring(16,18);
//                                    var nsMinute = event.start.toString().substring(19,21);                          
//                                    var neHour = event.end.toString().substring(16,18);
//                                    var neMinute = event.end.toString().substring(19,21);
//                                    var newStart = new moment(childsnapshot.val().start).set({hour:nsHour, minute:nsMinute})
//                                    var newEnd = new moment(childsnapshot.val().end).set({hour:neHour,minute: neMinute});
//                                    ref.child(childsnapshot.key()).update({
//                                        start: newStart.toISOString(),
//                                        end:newEnd.toISOString()
//                                    });
//
//                                };
//                            });
//                        });
//                    }
//            }
//        }
//        
//        
//        
//    return{
//        recurringEventMethods: function(start, end, eventId,ref){
//             var today = moment(start).format('YYYY/MM/DD').replace(/-/g, "/");
//            // the reason that the substring cuts of the time string after 8 characters is because the full calendar will only add repeating events to the week view if it is just the the time like so 08:00:00.
//             var eventObj = {
//                    title:$("#eventInput").val(),
//                    range:{start:today, end:"2020/11/24"},
//                    start: new Date(start).toTimeString().substring(0,8),
//                    end: new Date(end).toTimeString().substring(0,8),
//                    id: eventId,
//                    recur:"weekly",
//                    eventType:"recurring event"
//            }
//             
//             var setDaysOfWeek = function(start){
//                var daysOfWeek = [];
//                if($("#sunday").prop("checked")){
//                    daysOfWeek.push(0);
//                };
//                if($("#monday").prop("checked")){
//                    daysOfWeek.push(1);
//                };
//                if($("#tuesday").prop("checked")){
//                    daysOfWeek.push(2);
//                };
//                if($("#wednesday").prop("checked")){
//                    daysOfWeek.push(3);
//                };
//                if($("#thursday").prop("checked")){
//                    daysOfWeek.push(4);
//                }; 
//                if($("#friday").prop("checked")){
//                    daysOfWeek.push(5);
//                }; 
//                if($("#saturday").prop("checked")){
//                    daysOfWeek.push(6);
//                };  
//                 
//                 if(daysOfWeek[0]== undefined){
//                     daysOfWeek.push(moment(start).day());
//                 }
//                return daysOfWeek ;
//             }
////             
//             
//             var checkOcc = function(occurBy){
//                    if($("#occurences").prop("checked")){
//                            eventObj.range = {
//                                start:today,
//                                end: moment(start).add($("#numOccur").val(), occurBy).format("YYYY/MM/DD").replace(/-/g,'/')
//                            }
//                    }
//                   if($("#endsOn").prop("checked")){
//                            eventObj.range = {
//                                start:today,
//                                end: $("#endDate").val().replace(/-/g,"/")
//                            }
//                    }
//                 return eventObj.range 
//             }
//             
//             var setAmtOfMonths = function(){
//                 if($("#occurences").prop("checked")){
//                     return $("#numOccur").val()
//                 } 
//                 if($("#endsOn").prop("checked")){
//                    var startMonth = new moment(start).month();
//                    var endMonth = $("#endDate").val().substring(5,7);
//                    return endMonth-startMonth ;
//                 };
//                    return 10 
//             };
//
//             var meth = {
//                    createDailyEvent:function(){ 
//                        eventObj.dow = [0,1,2,3,4,5,6];
//                        console.log(moment(start).format("YYYY/MM/DD"))
//                        eventObj.recur = "daily" ;
//                        checkOcc("days");
//                        ref.push(eventObj);
//                        console.log(eventObj.range);
//                        refreshEvents();
//                    },
//                 
//                    createWeeklyEvent: function(){
//                         eventObj.dow = setDaysOfWeek(start) 
//                         checkOcc("week");
//                         ref.push(eventObj);
//                         refreshEvents();
//                         console.log($("#cal").fullCalendar("clientEvents"));
//                    },
//
//                     createMonthlyEvent:function(){
//                        eventObj.recur = "monthly";
//                        var view = $("#cal").fullCalendar('getView');
//                        for(var i =0; i < setAmtOfMonths() ;i++){
//                              eventObj.start= new moment(start).clone().add(i,"month").toISOString()
//                              eventObj.title= $("#eventInput").val()
//                              eventObj.range.end = moment(start).add(setAmtOfMonths(), "month").format("YYYY/MM/DD").replace(/-/g,'/')
//                              eventObj.end =new moment(end).clone().add(i,"month").toISOString()
//                              eventObjrecur= "monthly";
//                              ref.push(eventObj); 
//                        }
//                        refreshEvents();
//                     }
//             }
//             return meth ;
//        },
//        
//        onEventChange: function(event,ref){
//             if(event.recur == 'once'){
//                    updateEvents(event, ref).updateSingleEvent();   
//                }
//                if(event.recur =="weekly"){
//                    updateEvents(event, ref).updateWeeklyEvent();
//                }
//            
//                if(event.recur == "monthly"){
//                    updateEvents(event,ref).updateMonthlyEvent();
//                }
//        },
//
//        createEvent: function(start, end, ref){
//            $("#createEventButton").on("click", function (){
//                var test = [];
//                var eventId = $("#eventInput").val() + start.toString() + end.toString();
//                ref.once("value", function (snapshot) {
//                    snapshot.forEach(function (childsnapshot) {
//                        test.push(childsnapshot.val().id);
//                    });
//                });
//                
//                if (test.indexOf(eventId.replace(/[\s+\*\^\.\'\!\@\:\-\$]/g, '').toLowerCase()) == -1 &&            $("#eventInput").val().length != 0){
//                    if($("#dowCheckBox").prop("checked")){
//                            eventCreate.createRecurringEvent(start,end,eventId,ref)
//                    }else{
//                            eventCreate.createRegularEvent(start,end,eventId,ref);
//                    }
//
//                     $("#dowCheckBox").prop("checked", false);
//                     $("#recur").addClass("hide");
//                     $("#eventInput").val('');
//                 }
//                    else {
//                    alert("If this event already exists or you have not a entered a value, you can not create the event");
//                }   
//            });  
//        },
//        
//        saveCalSettings: function(startTime, endTime, googleCalendarId, ref){
//                if($('#googleSync').prop('checked')){
//                    ref.set(new CalSettings(startTime, endTime,googleCalendarId, true));
//                }else{
//                    ref.set(new CalSettings(startTime, endTime,googleCalendarId, false));
//                }
//        },
//        
//        approveAppointment: function(list, index, ref, ref1, ref2,fireObj){
//                var studentEmail = list[index].emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '');
//                console.log(studentEmail);
//                var studentRef = ref.child(studentEmail);
//                var studentObj = {
//                        start: list[index].requestedStartTime,
//                        end:list[index].requestedEndTime,
//                        firstName: fireObj.userData.firstName,
//                        lastName: fireObj.userData.lastName,
//                        emailAddress: fireObj.userData.emailAddress
//                }
//              
//                var examinerObj = {
//                    start:list[index].requestedStartTime,
//                    end:list[index].requestedEndTime,
//                    emailAddress:list[index].emailAddress,
//                    firstName: list[index].firstName,
//                    lastName:list[index].lastName,
//                    title: "appointment with " +list[index].firstName +" " +list[index].lastName,
//                    color: "red",
//                    eventType: "approved appointment"
//                }
//                fireObj.$loaded().then(function (){
//                    studentRef.child("upcomingAppointments").push(studentObj);
//                });
//                ref1.push(examinerObj);
//                ref2.push(examinerObj);
//                list.$remove(index);
//            },
//        
//        
//        syncGcal:function(userData, calendarGcalId){
//              userData.$loaded().then(function(){
//                             if(userData.synced == true){
//                                 calendarGcalId = data.googleCalendarId ;
//                                 $("#googleSync").prop("checked", true);
//                             };
//             });
//        },
//        
//        refreshEvents: function(calSelector, eventSource){
//            $(calSelector).fullCalendar('removeEventSource', eventSource);
//            $(calSelector).fullCalendar('removeEvents');
//            $(calSelector).fullCalendar('addEventSource', eventSource);
//        },
//        
//        checkDateRange: function(event){
//            if(event.recur != "once" && event.hasOwnProperty("range")){
//                            var eventDate = moment(event.start).format("YYYY/MM/DD");
//                            if(event.range.start > eventDate || event.range.end <eventDate){
//                                return false;
//                }
//            }
//        },
//        
//        eventClick: function(event, ref1, ref2, selector){
//            console.log(event.start);
//            $("#eventTitle").text("Event: " + event.title);
//            $("#eventDetailsModal #eventStart").text("start: " + event.start.toISOString());
//            $("#eventDetailsModal #eventEnd").text("end: " + event.end.toISOString());
//            $("#eventDetailsModal").addClass('showing');
//            $("#deleteButton").unbind();
//        
//            deleteEvents.deleteEvent(event, ref1,selector);
//            deleteEvents.deleteEvent(event, ref2, selector);
//        }
//    }
//}]);