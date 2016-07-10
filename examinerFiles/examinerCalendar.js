var app = angular.module('myApp', ['ui.calendar', 'firebase']);

app.controller('calendarController',['$scope','$firebaseArray', '$firebaseObject','$compile','uiCalendarConfig', 
                                 function($scope,$firebaseArray,$firebaseObject,$compile,uiCalendarConfig) {

         var userListRef = new Firebase("https://checkride.firebaseio.com/users");
         var authData = userListRef.getAuth();
         var userEmail = authData.password.email.replace( /[\*\^\.\'\!\@\$]/g , '');
         var userRef = new Firebase("https://checkride.firebaseio.com/users/" + userEmail);
         var userCalendarRef = userRef.child("calendar");
         var userEventsRef = userCalendarRef.child("events");
         var events = $firebaseArray(userEventsRef);  
                                     
         var approvedAppointmentsRef = userCalendarRef.child("approvedAppointments");
         var approvedApointments = $firebaseArray(approvedAppointmentsRef);
         var calendarConfigRef = userCalendarRef.child("settings");
                                     
         $scope.requestsList = $firebaseArray(userRef.child("appointmentRequests"));
         userRef.child("appointmentRequests").on("child_added", function(datasnapshot){
             alert("you have a new appointment request");
         });
         
         
          $scope.eventSources = [events, approvedApointments];
          $scope.uiConfig = {
                  calendar:{
                    height: '100%',
                    editable: true,
                    customButtons:{
                        pendingRequestsButton:{
                           text:'Pending Requests',
                           click: function(){
                               pendingRequestButtonEvent($scope.requestsList);
                           } 
                        },
                        settingsButton:{
                            text:'settings',
                            click: function(){
                                $("#settingsModal").css("display", "block");
                            },
                            buttonIcons:false,
                            themeButtonIcons:false
                        }
                    },
                    header:{
                      left: 'month agendaWeek  agendaDay ',
                      center: 'title',
                      right: 'today prev,next pendingRequestsButton settingsButton'
                    },
                    selectable:true,
                      selectable: {
                            month: true,
                            agenda: true
                        },
                    unselectAuto:true,

                    select: function(start,end,ev){
                        $("#addEventModal").css("display","block");
                        $("#eventStart").text(start.toString());
                        $("#eventEnd").text(end.toString());
                        $("#createEventButton").unbind();
                        createEvent(start, end, userEventsRef);
                    },   
                    editable:true,
                    eventClick: function(event, element){
                        $("#eventTitle").text("Event: " + event.title);
                        $("#eventDetailsModal #eventStart").text("start: " + event.start.toISOString());
                        $("#eventDetailsModal #eventEnd").text("end: " + event.end.toISOString());
                        $("#eventDetailsModal").css("display", "block");
                            deleteButtonEvent(event, userEventsRef);
                            deleteButtonEvent(event,approvedAppointmentsRef);
                    },
                    eventDrop: function(event,element){
                        onEventChange(event,element, userEventsRef);
                    },
                    eventResize: function(event, element){
                        onEventChange(event,element,userEventsRef);
                    },
                    eventRender: $scope.eventRender
                  }
    };
            

//    //  gets all the events from the db 
//         var events = $firebaseArray(eventsRef);
//         $scope.eventSources = [events];
//         console.log(events);

    
 // takes the users saved calendar settings from db and adds events in events[] to calendar  
    var setUpCalendar = function(fireRef){
      fireRef.on("value",function(snapshot){
            var startTime = snapshot.val().minTime;
            var endTime = snapshot.val().maxTime ;
            $scope.uiConfig.calendar.minTime = startTime.toString() ;
            $scope.uiConfig.calendar.maxTime = endTime.toString() ; 
            $("#loggedInUser").text(userEmail);
        });
    }
    setUpCalendar(calendarConfigRef);
 
    
                                 
 //when a event gets changed this updates the event in the database
    var onEventChange = function(event, element, fireRef){
        for(var i =0; i<events.length; i++){
            if(event.title == events[i].title){
                events[i].start = event.start.toISOString();
                events[i].end =  event.end.toISOString() ;
                fireRef.once("value", function(snapshot){
                    snapshot.forEach(function(childSnapshot){
                       if(childSnapshot.val().title == event.title){
                           fireRef.child(childSnapshot.key()).update({title: event.title, start:event.start.toString(), end: event.end.toString(), id:event.title +event.start.toString() +event.end.toString()})
                       } 
                    });
                });
            }
        }
    }
  // button inside of addEventModal, called in select function inside of calendar config to get access to selected start and end time  
    var createEvent = function(start, end, fireRef){
        $("#createEventButton").on("click", function(){
                            var test = [];
                            var eventId =$("#eventInput").val()+ start.toString() + end.toString();
                            fireRef.once("value",function(snapshot){
                               snapshot.forEach(function(childsnapshot){
                                   test.push(childsnapshot.val().id);
                               });
                            });
                            if(test.indexOf($("#eventInput").val()+ start.toString() + end.toISOString()) == -1 && $("#eventInput").val().length !=0){
                                fireRef.push({
                                                title:$("#eventInput").val(), 
                                                start: start.toISOString(), 
                                                end: end.toISOString(),
                                                id:eventId         
                                });

                                $(".modal").css("display", "none");
                                $("#eventInput").val('');

                            }else{
                                alert("Please make sure you have entered an event");
                            }
                        });
                    }
    
   // deletes the selected event from the calendar , gets called in the event click method
    var deleteButtonEvent = function(event, fireRef){
        $("#deleteButton").on("click",function(){
            fireRef.once("value", function(dataSnapshot){
                dataSnapshot.forEach(function(childSnapshot){
                    if(childSnapshot.val().title.toLowerCase() == event.title.toLowerCase()){
                        var eventToDelete = fireRef.child(childSnapshot.key());
                        eventToDelete.remove();
                        $("#cal").fullCalendar('refetchEventSources', events );
                        $("#eventDetailsModal").css("display", "none");
                    }
                });
            });
        });
    }
   

    
    //  closes modal boxes
    var closeModal = function(){
        $(".modal").css("display", "none");
        $("span.close").on("click", function(){
             $(".modal").css("display", "none");
        });
    }
closeModal();
    
        
    // constructor for the users calendar settings called in saveCalSettings function
     var userCalSettings = function(minTime, maxTime){
        this.minTime = minTime;
        this.maxTime = maxTime
    }
     
    //click event for save button inside settings modal to save the users specified settings
     $scope.saveCalSettings = function(){
            var startTime = $("#calendarStartTime").val();
            var endTime = $("#calendarEndTime").val();
            if(startTime.length == 0 || endTime.length== 0){
                alert("Please enter a start and end time for your calendar")
            }
            else{
                calendarConfigRef.set(new userCalSettings(startTime, endTime))
                        console.log(startTime +" " +endTime);
                        setUpCalendar(calendarConfigRef); 
                        closeModal();
                }
           
    }
   
                
                                     
    //gets the pending appointment requests and shows it when the pending Request button is clicked, it is clicked in calendar config under custom buttons.
    
    var pendingRequestButtonEvent =function(list){
       list.$loaded().then(function(){
            if(list.length != 0){          
                $("#pendingRequestsModal").css("display", "block");
            }else{
                alert("Sorry you have no requests");
            }
        });
    }          
    
    // alerts the student who requested the appointment that the appointment is confirmed and adds an appointment to the examiners calendar. gets called in html file with ng-click
    $scope.approveButtonEvent = function(index){
        var studentEmail = $scope.requestsList[index].emailAddress.replace(/[\*\^\.\'\!\@\$]/g , '');
        var studentRef = userListRef.child(studentEmail);
        var examinerInfo = $firebaseObject(userRef);
        examinerInfo.$loaded().then(function(){
            studentRef.child("upcomingAppointments").push({
                start:$scope.requestsList[index].requestedStartTime, 
                end:$scope.requestsList[index].requestedEndTime,
                firstName:examinerInfo.userData.firstName,
                lastName: examinerInfo.userData.lastName,
                emailAddress:examinerInfo.userData.emailAddress
            });
        });
        studentRef.child("upcomingAppointments").push({
            start:$scope.requestsList[index].requestedStartTime, 
            end:$scope.requestsList[index].requestedEndTime,
            title:"appointment with " + $scope.requestsList[index].student,
            examiner:
        });
        userCalendarRef.child("approvedAppointments").push({
            start:$scope.requestsList[index].requestedStartTime, 
            end:$scope.requestsList[index].requestedEndTime,
            title:"appointment with " + $scope.requestsList[index].student,
            color:"red" 
        });
        $scope.requestsList.$remove(index);
        closeModal();
    };                                   
}]);
    

//    /* alert on eventClick */
//    $scope.alertOnEventClick = function( date, jsEvent, view){
//        $scope.alertMessage = (date.title + ' was clicked ');
//    };
//    /* alert on Drop */
//     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
//       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
//    };
//    /* alert on Resize */
//    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
//       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
//    };
//    /* add and removes an event source of choice */
//    $scope.addRemoveEventSource = function(sources,source) {
//      var canAdd = 0;
//      angular.forEach(sources,function(value, key){
//        if(sources[key] === source){
//          sources.splice(key,1);
//          canAdd = 1;
//        }
//      });
//      if(canAdd === 0){
//        sources.push(source);
//      }
//    };
//    /* add custom event*/
//    $scope.addEvent = function() {
//      $scope.events.push({
//        title: 'Open Sesame',
//        start: new Date(y, m, 28),
//        end: new Date(y, m, 29),
//        className: ['openSesame']
//      });
//    };
//    /* remove event */
//    $scope.remove = function(index) {
//      $scope.events.splice(index,1);
//    };
//    /* Change View */
//    $scope.changeView = function(view,calendar) {
//      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
//    };
//    /* Change View */
//    $scope.renderCalender = function(calendar) {
//      if(uiCalendarConfig.calendars[calendar]){
//        uiCalendarConfig.calendars[calendar].fullCalendar('render');
//      }
//    };
//     /* Render Tooltip */
//    $scope.eventRender = function( event, element, view ) { 
//        element.attr({'tooltip': event.title,
//                     'tooltip-append-to-body': true});
//        $compile(element)($scope);
//    };
//    
// 
    /* config object */
//    $scope.uiConfig = {
//      calendar:{
//        height: '100%',
//        editable: true,
//        customButtons:{
//            settingsButton:{
//                text:'settings',
//                click: function(){
//                    $("#settingsModal").css("display", "block");
//                },
//                buttonIcons:false,
//                themeButtonIcons:false
//            }
//        },
//        header:{
//          left: 'month agendaWeek  agendaDay ',
//          center: 'title',
//          right: 'today prev,next settingsButton'
//        },
//        selectable:true,
//          selectable: {
//				month: true,
//				agenda: true
//			},
//        unselectAuto:true,
//        
//        select: function(start,end,ev){
//            $("#addEventModal").css("display","block");
//            $("#eventStart").text(start.toString());
//            $("#eventEnd").text(end.toString());
//            $("#createEventButton").unbind();
//            $("#createEventButton").on("click", function(){
//                var test = [];
//                var eventId =$("#eventInput").val()+ start.toString() + end.toString();
//                eventsRef.once("value",function(snapshot){
//                   snapshot.forEach(function(childsnapshot){
//                       test.push(childsnapshot.val().id);
//                   });
//                });
//                if(test.indexOf($("#eventInput").val()+ start.toString() + end.toISOString()) == -1 && $("#eventInput").val().length !=0){
//                    eventsRef.push({
//                                    title:$("#eventInput").val(), 
//                                    start: start.toISOString(), 
//                                    end: end.toISOString(),
//                                    id:eventId         
//                    });
//                    
//                    $(".modal").css("display", "none");
//                    $("#eventInput").val('');
//            
//                }else{
//                    alert("Please make sure you have entered an event");
//                }
//         
//            });
//        },
//        editable:true,
//        eventClick: function(event, element){
//            $("#eventTitle").text("Event: " + event.title);
//            $("#eventDetailsModal #eventStart").text("start: " + event.start.toISOString());
//            $("#eventDetailsModal #eventEnd").text("end: " + event.end.toISOString());
//            $("#eventDetailsModal").css("display", "block");
//            deleteButtonEvent(event);
//        },
//        eventDrop: function(event,element){
//            onEventChange(event,element);
//        },
//        eventResize: function(event, element){
//            onEventChange(event,element);
//        },
//        eventRender: $scope.eventRender
//      }
//    };
//
//    $scope.changeLang = function() {
//      if($scope.changeTo === 'Hungarian'){
//        $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
//        $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
//        $scope.changeTo= 'English';
//      } else {
//        $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//        $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//        $scope.changeTo = 'Hungarian';
//      }
//    };
    /* event sources array*/
    

// if i want to use google calendar as a source.
//    $scope.eventSource = {
//            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
//            className: 'gcal-event',           // an option!
//            currentTimezone: 'America/Chicago' // an option!
//    };

