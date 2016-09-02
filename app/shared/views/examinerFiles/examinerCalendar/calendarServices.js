var app = angular.module('examinerCalendar',[]);

app.service("calendarService", [function(){
       // constructor for the users calendar settings called in saveCalSettings function
        var CalSettings = function (minTime, maxTime, googleCalendarId, synced) {
            this.minTime = minTime;
            this.maxTime = maxTime
            this.googleCalendarId = googleCalendarId ;
            this.synced = synced;
        }
        
        var eventCreate = {
                createRegularEvent: function(start, end, eventId, ref){         
                    var eventObj ={
                                        title:$("#eventInput").val(),
                                        recur:"once",
                                        start:start.toISOString(),
                                        end: end.toISOString(),
                                        id: eventId.replace(/[\s+\*\^\.\'\!\@\:\-\$]/g, '').toLowerCase(),
                                        eventType:"regular event"
                                   }
                    ref.push(eventObj);   
                },
        
               createRecurringEvent: function(start, end,eventId,ref){
                    switch($("#freq").val().toLowerCase()){   
                        case "daily":  
                                recurringEventMethods(start,end,eventId,ref).createDailyEvent();
                                break;

                        case "weekly":
                                recurringEventMethods(start,end,eventId,ref).createWeeklyEvent();
                                break;

                        case "monthly": 
                                recurringEventMethods(start, end, eventId,ref).createMonthlyEvent();
                                break;
                    };
               }       
            }
        
        
        var deleteEvents = {
             deleteMonthlyEvent:function(event, ref){
                        $('#deleteMonthlyEvent').removeClass("hide");
                        $("#oneEvent").on("click", function(){
                           var eventToDelete = ref.child(event.$id) ;
                           eventToDelete.remove();
                           
                        });
                        $("#allEvents").on("click",function(){
                            ref.once("value", function(datasnapshot){
                                datasnapshot.forEach(function(childsnapshot){
                                    if(childsnapshot.val().title == event.title){
                                        ref.child(childsnapshot.key()).remove();
                                    }
                                });
                            });
                        });
                    },
             removeEvent: function(event, ref){
                   var eventToDelete = ref.child(event.$id) ;
                   eventToDelete.remove();

//                   $("#eventDetailsModal").removeClass("showing");
                },
            
             deleteEvent: function(event, ref, selector){
                $(selector).on("click", function () {
                    if(event.recur == "monthly"){
                        deleteEvents.deleteMonthlyEvent(event,ref)
                    }
                    else{
                        deleteEvents.removeEvent(event, ref);
                   }
                });
            }
        }
        
        
        var updateEvents = function(event, ref){
        return{
             updateSingleEvent: function(){
             ref.child(event.$id).update({
                        title: event.title,
                        start: event.start.toISOString(),
                        end: event.end.toISOString(),
                        id: event.title + event.start.toISOString() + event.end.toISOString()
                    }); 
             },
             
             updateWeeklyEvent: function(){
                              var clientEvents = $("#cal").fullCalendar("clientEvents");
                              if(event.dow.length > 1){
                                    ref.child(event.$id).update({
                                            start: event.start.toString().substring(16,24),
                                            end: event.end.toString().substring(16,24),
                                            id: event.title + event.start.toString() + event.end.toString()
                                    });
                              }else{
                                   ref.child(event.$id).update({
                                            dow:event.start.day(),
                                            start: event.start.toString().substring(16,24),
                                            end: event.end.toString().substring(16,24),
                                            id: event.title + event.start.toString() + event.end.toString()
                                    });
                              }
                        },
            updateMonthlyEvent: function(){
                        //reminder properbel is _i is original time not new event time , look at event itself more
                        ref.once("value", function(datasnapshot){
                            datasnapshot.forEach(function(childsnapshot){
                                if(childsnapshot.val().title == event.title){
                                    var nsHour = event.start.toString().substring(16,18);
                                    var nsMinute = event.start.toString().substring(19,21);                          
                                    var neHour = event.end.toString().substring(16,18);
                                    var neMinute = event.end.toString().substring(19,21);
                                    var newStart = new moment(childsnapshot.val().start).set({hour:nsHour, minute:nsMinute})
                                    var newEnd = new moment(childsnapshot.val().end).set({hour:neHour,minute: neMinute});
                                    ref.child(childsnapshot.key()).update({
                                        start: newStart.toISOString(),
                                        end:newEnd.toISOString()
                                    });

                                };
                            });
                        });
                    }
            }
        }
        
        
        
    return{
        recurringEventMethods: function(start, end, eventId,ref){
             var today = moment(start).format('YYYY/MM/DD').replace(/-/g, "/");
            // the reason that the substring cuts of the time string after 8 characters is because the full calendar will only add repeating events to the week view if it is just the the time like so 08:00:00.
             var eventObj = {
                    title:$("#eventInput").val(),
                    range:{start:today, end:"2020/11/24"},
                    start: new Date(start).toTimeString().substring(0,8),
                    end: new Date(end).toTimeString().substring(0,8),
                    id: eventId,
                    recur:"weekly",
                    eventType:"recurring event"
            }
             
             var setDaysOfWeek = function(start){
                var daysOfWeek = [];
                if($("#sunday").prop("checked")){
                    daysOfWeek.push(0);
                };
                if($("#monday").prop("checked")){
                    daysOfWeek.push(1);
                };
                if($("#tuesday").prop("checked")){
                    daysOfWeek.push(2);
                };
                if($("#wednesday").prop("checked")){
                    daysOfWeek.push(3);
                };
                if($("#thursday").prop("checked")){
                    daysOfWeek.push(4);
                }; 
                if($("#friday").prop("checked")){
                    daysOfWeek.push(5);
                }; 
                if($("#saturday").prop("checked")){
                    daysOfWeek.push(6);
                };  
                 
                 if(daysOfWeek[0]== undefined){
                     daysOfWeek.push(moment(start).day());
                 }
                return daysOfWeek ;
             }
//             
             
             var checkOcc = function(occurBy){
                    if($("#occurences").prop("checked")){
                            eventObj.range = {
                                start:today,
                                end: moment(start).add($("#numOccur").val(), occurBy).format("YYYY/MM/DD").replace(/-/g,'/')
                            }
                    }
                   if($("#endsOn").prop("checked")){
                            eventObj.range = {
                                start:today,
                                end: $("#endDate").val().replace(/-/g,"/")
                            }
                    }
                 return eventObj.range 
             }
             
             var setAmtOfMonths = function(){
                 if($("#occurences").prop("checked")){
                     return $("#numOccur").val()
                 } 
                 if($("#endsOn").prop("checked")){
                    var startMonth = new moment(start).month();
                    var endMonth = $("#endDate").val().substring(5,7);
                    return endMonth-startMonth ;
                 };
                    return 10 
             };

             var meth = {
                    createDailyEvent:function(){ 
                        eventObj.dow = [0,1,2,3,4,5,6];
                        console.log(moment(start).format("YYYY/MM/DD"))
                        eventObj.recur = "daily" ;
                        checkOcc("days");
                        ref.push(eventObj);
                        console.log(eventObj.range);
                        refreshEvents();
                    },
                 
                    createWeeklyEvent: function(){
                         eventObj.dow = setDaysOfWeek(start) 
                         checkOcc("week");
                         ref.push(eventObj);
                         refreshEvents();
                         console.log($("#cal").fullCalendar("clientEvents"));
                    },

                     createMonthlyEvent:function(){
                        eventObj.recur = "monthly";
                        var view = $("#cal").fullCalendar('getView');
                        for(var i =0; i < setAmtOfMonths() ;i++){
                              eventObj.start= new moment(start).clone().add(i,"month").toISOString()
                              eventObj.title= $("#eventInput").val()
                              eventObj.range.end = moment(start).add(setAmtOfMonths(), "month").format("YYYY/MM/DD").replace(/-/g,'/')
                              eventObj.end =new moment(end).clone().add(i,"month").toISOString()
                              eventObjrecur= "monthly";
                              ref.push(eventObj); 
                        }
                        refreshEvents();
                     }
             }
             return meth ;
        },
        
        onEventChange: function(event,ref){
             if(event.recur == 'once'){
                    updateEvents(event, ref).updateSingleEvent();   
                }
                if(event.recur =="weekly"){
                    updateEvents(event, ref).updateWeeklyEvent();
                }
            
                if(event.recur == "monthly"){
                    updateEvents(event,ref).updateMonthlyEvent();
                }
        },

        createEvent: function(start, end, ref){
            $("#createEventButton").on("click", function (){
                var test = [];
                var eventId = $("#eventInput").val() + start.toString() + end.toString();
                ref.once("value", function (snapshot) {
                    snapshot.forEach(function (childsnapshot) {
                        test.push(childsnapshot.val().id);
                    });
                });
                
                if (test.indexOf(eventId.replace(/[\s+\*\^\.\'\!\@\:\-\$]/g, '').toLowerCase()) == -1 &&            $("#eventInput").val().length != 0){
                    if($("#dowCheckBox").prop("checked")){
                            eventCreate.createRecurringEvent(start,end,eventId,ref)
                    }else{
                            eventCreate.createRegularEvent(start,end,eventId,ref);
                    }

                     $("#dowCheckBox").prop("checked", false);
                     $("#recur").addClass("hide");
                     $("#eventInput").val('');
                 }
                    else {
                    alert("If this event already exists or you have not a entered a value, you can not create the event");
                }   
            });  
        },
        
        saveCalSettings: function(startTime, endTime, googleCalendarId, ref){
                if($('#googleSync').prop('checked')){
                    ref.set(new CalSettings(startTime, endTime,googleCalendarId, true));
                }else{
                    ref.set(new CalSettings(startTime, endTime,googleCalendarId, false));
                }
        },
        
        approveAppointment: function(list, index, ref, ref1, ref2,fireObj){
                var studentEmail = list[index].emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '');
                console.log(studentEmail);
                var studentRef = ref.child(studentEmail);
                var studentObj = {
                        start: list[index].requestedStartTime,
                        end:list[index].requestedEndTime,
                        firstName: fireObj.userData.firstName,
                        lastName: fireObj.userData.lastName,
                        emailAddress: fireObj.userData.emailAddress
                }
              
                var examinerObj = {
                    start:list[index].requestedStartTime,
                    end:list[index].requestedEndTime,
                    emailAddress:list[index].emailAddress,
                    firstName: list[index].firstName,
                    lastName:list[index].lastName,
                    title: "appointment with " +list[index].firstName +" " +list[index].lastName,
                    color: "red",
                    eventType: "approved appointment"
                }
                fireObj.$loaded().then(function (){
                    studentRef.child("upcomingAppointments").push(studentObj);
                });
                ref1.push(examinerObj);
                ref2.push(examinerObj);
                list.$remove(index);
            },
        
        
        syncGcal:function(userData, calendarGcalId){
              userData.$loaded().then(function(){
                             if(userData.synced == true){
                                 calendarGcalId = userData.googleCalendarId ;
                                 $("#googleSync").prop("checked", true);
                             };
             });
        },
        
        refreshEvents: function(calSelector, eventSource){
            $(calSelector).fullCalendar('removeEventSource', eventSource);
            $(calSelector).fullCalendar('removeEvents');
            $(calSelector).fullCalendar('addEventSource', eventSource);
        },
        
        checkDateRange: function(event){
            if(event.recur != "once" && event.hasOwnProperty("range")){
                            var eventDate = moment(event.start).format("YYYY/MM/DD");
                            if(event.range.start > eventDate || event.range.end <eventDate){
                                return false;
                }
            }
        },
        
        eventClick: function(event, ref1, ref2, selector){
            console.log(event.start);
            $("#eventTitle").text("Event: " + event.title);
            $("#eventDetailsModal #eventStart").text("start: " + event.start.toISOString());
            $("#eventDetailsModal #eventEnd").text("end: " + event.end.toISOString());
            $("#eventDetailsModal").addClass('showing');
            $("#deleteButton").unbind();
        
            deleteEvents.deleteEvent(event, ref1,selector);
            deleteEvents.deleteEvent(event, ref2, selector);
        }
    }
}]);

app.controller("examinerCalendar",  ['$window','$scope', '$firebaseArray', '$firebaseObject', '$compile', 'uiCalendarConfig','commonServices',"calendarService",
      function ($window,$scope, $firebaseArray, $firebaseObject, $compile, uiCalendarConfig, commonServices, calendarService){

        var userListRef = new Firebase("https://checkride.firebaseio.com/users");
        var authData = userListRef.getAuth();           
        var userEmail = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');                        
        var userRef = userListRef.child(userEmail);
        var userCalendarRef = userRef.child("calendar");
        var userEventsRef = userCalendarRef.child("events");
        var approvedAppointmentsRef = userCalendarRef.child("approvedAppointments");
        var calendarConfigRef = userCalendarRef.child("settings");
        var appointmentRequestsListRef = userRef.child("appointmentRequests");                 
        var userInfo = $firebaseObject(userRef); 
        var calSettingsInfo = $firebaseObject(calendarConfigRef);
        var check= [];
        var arr= [];      
        var events = $firebaseArray(userEventsRef);
        var approvedApointments = $firebaseArray(approvedAppointmentsRef);
          

        // the requests list is a list of all student appointment request for the logged in examiner                             
        $scope.requestsList = $firebaseArray(appointmentRequestsListRef);
          
        
        var callFunctions = function(){
            newRequestToast(appointmentRequestsListRef);
            configureCalendar(userEventsRef, userListRef, approvedAppointmentsRef);
            setUpCalendar(calendarConfigRef);
            saveCalSettings(calendarConfigRef);
            approveApptRequest($scope.requestsList,userListRef, userEventsRef ,approvedAppointmentsRef);
            syncWithGcal(calSettingsInfo);
            setNameField();
        };

        var initializeRequestsList = function(){
            commonServices.orderArray($scope.requestsList, "-sentAt")
        };

         //shows when a new appointment request has been received                            
         var newRequestToast = function(ref){
             commonServices.showToastOnEvent(ref,"child_added");
         }
         
        // username object is used to set the user name in the top left corner of navbar                             
        var setNameField = function(){        
            commonServices.setDataField(userInfo, "#userName");
        }
                
        //used to get the users gmail if they have chosen to sync with gcal                                   
        var syncWithGcal = function(data){
          calendarService.syncGcal(data, $scope.uiConfig.calendar.events.googleCalendarId)
        }
        var test=[];
                        
        // takes the users saved calendar settings from db and adds events in events[] to calendar  
        var setUpCalendar = function (ref) {
            ref.on("value", function (snapshot){
                $("#loggedInUser").text(userEmail);
                if(snapshot.hasChild("minTime")){
                    var startTime = snapshot.val().minTime;
                    var endTime = snapshot.val().maxTime;
                    // giving owner document error
/*                    $scope.uiConfig.calendar.minTime = startTime.toString();
                    $scope.uiConfig.calendar.maxTime = endTime.toString();*/
                }
            });
        }
                              

        var onEventChange = function (event,  ref) {
                calendarService.onEventChange(event,ref);
        }
        
        var createEvent = function (start, end, ref){
            calendarService.createEvent(start,end, userEventsRef);
        }
          
        var createRecurringEvent = function(start, end,eventId){
             calendarService.createRecurringEvent(start,end,eventId);
        }

        var createRegularEvent = function(start, end, eventId){
            calendarService.createRegularEvent(start,end,eventId,userEventsRef);
        }

        var deleteEvent = function (event,ref) {
            calendarService.deleteEvent(event, ref,"#deleteButton");
        }

        var saveCalSettings = function(ref){
            $("#saveButton").on("click", function(){
                var startTime = $("#calendarStartTime").val();
                var endTime = $("#calendarEndTime").val();
                var googleCalendarId = $("#googleCalendarId").val();
                calendarService.saveCalSettings(startTime, endTime, googleCalendarId, ref);
                console.log('hammmies')
            });
        }

         var pendingRequestButtonEvent = function (list){
            list.$loaded().then(function () {
                if (list.length != 0) {
                    $("#pendingRequestsModal").addClass("showing");
                } else {
                    alert("Sorry you have no requests");
                }
            });
        }

        var approveApptRequest = function(list, userListRef, userEventsRef,approvedAppointmentsRef){
            $scope.approveButtonEvent = function (index) {
                calendarService.approveAppointment(list,index, userListRef ,userEventsRef, approvedAppointmentsRef, userInfo);
            };   
        }
        
        
//        //  closes modal boxes when x button is clicked
//        var closeModal = function () {
//            $("span.close").on("click", function () {
//                $(".modal").css("display", "none");
//                $("#addEventModal").removeClass("showing");
//                $("#recur").addClass("hide");
//                $("#dowCheckBox").prop("checked", false);
//            });
//        }
        
        $scope.eventSources = [];
          
        // ui config where we set up all of our calendar configurations
        var configureCalendar = function(userEventsRef, userListRef, approvedAppointmentsRef){
            $scope.uiConfig = {
                calendar: {
//                    googleCalendarApiKey: 'AIzaSyA0IwuIvriovVNGQiaN-q2pKYIpkWqSg0c',
                    // reason why events is empty is because it needs to be added as a property to later access it to add the gcal events from settings data
                    events: events,
                 
                    slotEventOverlap:false,
                    allDayDefault: false,
                    defaultView:"agendaWeek",
                    timezone:"local",
                    height: '100%',
                    editable: true,
                    allDaySlot:false,
                    snapDuration:"02:00:00",
                    customButtons: {
                        pendingRequestsButton: {
                            text: 'Pending Requests',
                            click: function (){
                                pendingRequestButtonEvent($scope.requestsList);
                            }
                        },
                        settingsButton: {
                            text: 'settings',
                            click: function () {
                                $("#settingsModal").addClass("showing");
                            },
                            buttonIcons: false,
                            themeButtonIcons: false
                        }
                    },
                    lazyFetching:true,
                    header: {
                        left: 'month agendaWeek  agendaDay ',
                        center: 'title',
                        right: 'today prev,next pendingRequestsButton settingsButton'
                    },
                    selectable: true,
                    selectable: {
                        month: true,
                        agenda: true
                    },
                    unselectAuto: true,
                    select: function (start, end, ev) {
                        $("#addEventModal").addClass("showing");
                        $("#eventStart").text(start.toString());
                        $("#eventEnd").text(end.toString());
                        $("#createEventButton").unbind();
                        createEvent(start, end);
                    },
                    editable: true,
                    eventClick: function (event, element) {
                        calendarService.eventClick(event,userEventsRef,approvedAppointmentsRef, "#deleteButton");
                    },
                    eventDrop: function ( event , element) {
                        onEventChange(event, userEventsRef);
                    },
                    eventResize: function (event , element) {
                        onEventChange(event, userEventsRef);
                    },
                    eventRender: function(event,element,view){  
                        calendarService.checkDateRange(event);
                    },
                    viewRender:function(view, element){
                    },
                    eventAfterAllRender:function(view){
                        
                    }
                }
            }
        }

          
        callFunctions();
        
}]);



//
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
//                createRegularEvent: function(title, start, end, eventId, ref){         
//                    var eventObj ={
//                                        title: title,
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
////            $("#createEventButton").on("click", function (){
////                var test = [];
////                var eventId = $("#eventInput").val() + start.toString() + end.toString();
////                ref.once("value", function (snapshot) {
////                    snapshot.forEach(function (childsnapshot) {
////                        test.push(childsnapshot.val().id);
////                    });
////                });
////                
////                if (test.indexOf(eventId.replace(/[\s+\*\^\.\'\!\@\:\-\$]/g, '').toLowerCase()) == -1 &&            $("#eventInput").val().length != 0){
////                    if($("#dowCheckBox").prop("checked")){
////                            eventCreate.createRecurringEvent(start,end,eventId,ref)
////                    }else{
////                            eventCreate.createRegularEvent(start,end,eventId,ref);
////                    }
////
////                     $("#dowCheckBox").prop("checked", false);
////                     $("#recur").addClass("hide");
////                     $("#eventInput").val('');
////                 }
////                    else {
////                    alert("If this event already exists or you have not a entered a value, you can not create the event");
////                }   
////            });  
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
//                 if(userData.synced == true){
//                     calendarGcalId = userData.googleCalendarId ;
//                     $("#googleSync").prop("checked", true);
//
//                 }; 
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
//
//
//app.controller("examinerCalendar",  ['$window','$scope', '$firebaseArray', '$firebaseObject', '$compile', 'uiCalendarConfig','commonServices',"calendarService",
//      function ($window,$scope, $firebaseArray, $firebaseObject, $compile, uiCalendarConfig, commonServices, calendarService){
//
//        var userListRef = new Firebase("https://checkride.firebaseio.com/users");
//        var authData = userListRef.getAuth();           
//        var userEmail = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');                        
//        var userRef = userListRef.child(userEmail);
//        var userCalendarRef = userRef.child("calendar");
//        var userEventsRef = userCalendarRef.child("events");
//        var approvedAppointmentsRef = userCalendarRef.child("approvedAppointments");
//        var calendarConfigRef = userCalendarRef.child("settings");
//        var appointmentRequestsListRef = userRef.child("appointmentRequests");                 
//        var userInfo = $firebaseObject(userRef); 
//        var calSettingsInfo = $firebaseObject(calendarConfigRef);
//        var check= [];
//        var arr= [];      
//        var events = $firebaseArray(userEventsRef);
//        var approvedApointments = $firebaseArray(approvedAppointmentsRef);
//          
//
//        // the requests list is a list of all student appointment request for the logged in examiner                             
//        $scope.requestsList = $firebaseArray(appointmentRequestsListRef);
//        
//        
//        var callFunctions = function(){
//            newRequestToast(appointmentRequestsListRef);
//            configureCalendar(userEventsRef, userListRef, approvedAppointmentsRef);
//            setUpCalendar(calendarConfigRef);
////            closeModal();
//            saveCalSettings(calendarConfigRef);
//            approveApptRequest($scope.requestsList,userListRef, userEventsRef ,approvedAppointmentsRef);
//            syncWithGcal(calSettingsInfo);
//            setNameField();
//        };
//
//        var initializeRequestsList = function(){
//            commonServices.orderArray($scope.requestsList, "-sentAt")
//        };
//
//         //shows when a new appointment request has been received                            
//         var newRequestToast = function(ref){
//             commonServices.showToastOnEvent(ref, "appointmentRequests", "child_added");
//         }
//         
//        // username object is used to set the user name in the top left corner of navbar                             
//        var setNameField = function(){        
//            commonServices.setDataField(userInfo, "#userName");
//        }
//                
//        //used to get the users gmail if they have chosen to sync with gcal                                   
//        var syncWithGcal = function(data){
//          calendarService.syncGcal(data, $scope.uiConfig.calendar.events.googleCalendarId)
//        }
//        var test=[];
//                        
//        // takes the users saved calendar settings from db and adds events in events[] to calendar  
//        var setUpCalendar = function (ref) {
//            ref.on("value", function (snapshot){
//                $("#loggedInUser").text(userEmail);
//                if(snapshot.hasChild("minTime")){
//                    var startTime = snapshot.val().minTime;
//                    var endTime = snapshot.val().maxTime;
//                    // giving owner document error
///*                    $scope.uiConfig.calendar.minTime = startTime.toString();
//                    $scope.uiConfig.calendar.maxTime = endTime.toString();*/
//                }
//            });
//        }
//                              
//
//        var onEventChange = function (event,  ref) {
//                calendarService.onEventChange(event,ref);
//        }
//        
//        $scope.createEvent = function(){
//            calendarService.createEvent(start,end, userEventsRef);
//        }
//          
//        var createRecurringEvent = function(start, end,eventId){
//             calendarService.createRecurringEvent(start,end,eventId);
//        }
//
//        var createRegularEvent = function(start, end, eventId){
//            calendarService.createRegularEvent(start,end,eventId,userEventsRef);
//        }
//
//        var deleteEvent = function (event,ref) {
//            calendarService.deleteEvent(event, ref,"#deleteButton");
//        }
//
//        var saveCalSettings = function(ref){
//            $("#saveButton").on("click", function(){
//                var startTime = $("#calendarStartTime").val();
//                var endTime = $("#calendarEndTime").val();
//                var googleCalendarId = $("#googleCalendarId").val();
//                calendarService.saveCalSettings(startTime, endTime, googleCalendarId, ref);
//                console.log('hammmies')
//            });
//        }
//
//         var pendingRequestButtonEvent = function (list){
//            list.$loaded().then(function () {
//                if (list.length != 0) {
//                    $("#pendingRequestsModal").addClass("showing");
//                } else {
//                    alert("Sorry you have no requests");
//                }
//            });
//        }
//
//        var approveApptRequest = function(list, userListRef, userEventsRef,approvedAppointmentsRef){
//            $scope.approveButtonEvent = function (index) {
//                calendarService.approveAppointment(list,index, userListRef ,userEventsRef, approvedAppointmentsRef, userInfo);
//            };   
//        }
//        
//        
////        //  closes modal boxes when x button is clicked
////        var closeModal = function () {
////            $("span.close").on("click", function () {
////                $(".modal").css("display", "none");
////                $("#addEventModal").removeClass("showing");
////                $("#recur").addClass("hide");
////                $("#dowCheckBox").prop("checked", false);
////            });
////        }
//        
//        $scope.eventSources = [];
//          
//        // ui config where we set up all of our calendar configurations
//        var configureCalendar = function(userEventsRef, userListRef, approvedAppointmentsRef){
//            $scope.uiConfig = {
//                calendar: {
////                    googleCalendarApiKey: 'AIzaSyA0IwuIvriovVNGQiaN-q2pKYIpkWqSg0c',
//                    // reason why events is empty is because it needs to be added as a property to later access it to add the gcal events from settings data
//                    events: events,
//                 
//                    slotEventOverlap:false,
//                    allDayDefault: false,
//                    defaultView:"agendaWeek",
//                    timezone:"local",
//                    height: '100%',
//                    editable: true,
//                    allDaySlot:false,
//                    snapDuration:"02:00:00",
//                    customButtons: {
//                        pendingRequestsButton: {
//                            text: 'Pending Requests',
//                            click: function (){
//                                pendingRequestButtonEvent($scope.requestsList);
//                            }
//                        },
//                        settingsButton: {
//                            text: 'settings',
//                            click: function () {
//                                $("#settingsModal").addClass("showing");
//                            },
//                            buttonIcons: false,
//                            themeButtonIcons: false
//                        }
//                    },
//                    lazyFetching:true,
//                    header: {
//                        left: 'month agendaWeek  agendaDay ',
//                        center: 'title',
//                        right: 'today prev,next pendingRequestsButton settingsButton'
//                    },
//                    selectable: true,
//                    selectable: {
//                        month: true,
//                        agenda: true
//                    },
//                    unselectAuto: true,
//                    select: function (start, end, ev) {
//                        $("#addEventModal").addClass("showing");
//                        $("#eventStart").text(start.toString());
//                        $("#eventEnd").text(end.toString());
////                        $("#createEventButton").unbind();
////                        createEvent(start, end);
//                    },
//                    editable: true,
//                    eventClick: function (event, element) {
//                        calendarService.eventClick(event,userEventsRef,approvedAppointmentsRef, "#deleteButton");
//                    },
//                    eventDrop: function ( event , element) {
//                        onEventChange(event, userEventsRef);
//                    },
//                    eventResize: function (event , element) {
//                        onEventChange(event, userEventsRef);
//                    },
//                    eventRender: function(event,element,view){  
//                        calendarService.checkDateRange(event);
//                    },
//                    viewRender:function(view, element){
//                    },
//                    eventAfterAllRender:function(view){
//                        
//                    }
//                }
//            }
//        }          
//        callFunctions();
//        
//}]);