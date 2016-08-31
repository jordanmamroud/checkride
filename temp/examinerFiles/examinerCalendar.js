var app = angular.module('myApp', ['ui.calendar', 'firebase','examinerDirectives']);



app.controller('calendarController', ['$window','$scope', '$firebaseArray', '$firebaseObject', '$compile', 'uiCalendarConfig',
      function ($window,$scope, $firebaseArray, $firebaseObject, $compile, uiCalendarConfig) {
   
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
            closeModal();
            saveCalSettings(calendarConfigRef);
            approveApptRequest(userListRef, userEventsRef ,approvedAppointmentsRef);
            syncWithGcal(calSettingsInfo);
            setNameField();
        };

        var initializeRequestsList = function(){
          $scope.requestsList = $filter('orderBy')($scope.requestsList, '-sentAt');
        };
          
                                     
     
         //shows when a new appointment request has been received                            
         var newRequestToast = function(ref){
            ref.child("appointmentRequests").on("child_added", function (datasnapshot){
                                $('.toast').fadeIn(400).delay(3000).fadeOut(400);
            });
         }
         
        // username object is used to set the user name in the top left corner of navbar                             
        var setNameField = function(){        
            userInfo.$loaded().then(function(){
               $("#userName").text(userInfo.userData.firstName + " " + userInfo.userData.lastName); 
            });
        }
                
        //used to get the users gmail if they have chosen to sync with gcal                                   
        var syncWithGcal = function(data){
            data.$loaded().then(function(){
                 if(data.synced == true){
                     $scope.uiConfig.calendar.events.googleCalendarId = data.googleCalendarId ;
                 };
             });
        }
        var test=[];
        
         // event sources is where the calendar is pulling all of its events from.                            
      
        $scope.eventSources = [];
//        $("#cal").fullCalendar("addEventSource", events);
          
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
                                $("#settingsModal").css("display", "block");
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
                        $("#addEventModal").css("display", "block");
                        $("#eventStart").text(start.toString());
                        $("#eventEnd").text(end.toString());
                        $("#createEventButton").unbind();
                        createEvent(start, end);
                    },
                    editable: true,
                    eventClick: function (event, element) {
                         console.log(event.start);
                        $("#eventTitle").text("Event: " + event.title);
                        $("#eventDetailsModal #eventStart").text("start: " + event.start.toISOString());
                        $("#eventDetailsModal #eventEnd").text("end: " + event.end.toISOString());
                        $("#eventDetailsModal").css("display", "block");
                        $("#deleteButton").unbind();
                        deleteEvent(event, userEventsRef, userListRef);
                        deleteEvent(event, approvedAppointmentsRef, userListRef);
                    },
                    eventDrop: function ( event , element) {
                        onEventChange(event, userEventsRef);
                    },
                    eventResize: function (event , element) {
                        console.log(event);
                        onEventChange(event, userEventsRef);
                    },
                    eventRender: function(event,element,view){  
                        console.log('h');
                        if(event.recur != "once" && event.hasOwnProperty("range")){
                            var eventDate = moment(event.start).format("YYYY/MM/DD");
                            if(event.range.start > eventDate || event.range.end <eventDate){
                                return false;
                            }
                        }
                      
                    },
                    viewRender:function(view, element){
                    },
                    eventAfterAllRender:function(view){
                        
                    }
                }
            }
        }

          
        // takes the users saved calendar settings from db and adds events in events[] to calendar  
        var setUpCalendar = function (ref) {
            ref.on("value", function (snapshot){
                $("#loggedInUser").text(userEmail);
                if(snapshot.hasChild("minTime")){
                    var startTime = snapshot.val().minTime;
                    var endTime = snapshot.val().maxTime;
                    $scope.uiConfig.calendar.minTime = startTime.toString();
                    $scope.uiConfig.calendar.maxTime = endTime.toString();
                }
                if(snapshot.val().synced == true){
                    $("#googleSync").prop("checked", true);
                }
            });
        }
                              
        //when a event gets changed it updates the event in the database
        var onEventChange = function (event,  ref) {
                if(event.recur == 'once'){
                        ref.child(event.$id).update({
                            title: event.title,
                            start: event.start.toISOString(),
                            end: event.end.toISOString(),
                            id: event.title + event.start.toISOString() + event.end.toISOString()
                        }); 
                    }
                if(event.recur =="weekly"){
                    recurringEventMethods().updateWeeklyEvent(event,ref);
                }
            
                if(event.recur == "monthly"){
                    recurringEventMethods().updateMonthlyEvent(event, ref);
                }
            }
            
            
//                for (var i = 0; i < events.length; i++) {
//                    if (event.title == events[i].title) {
//                        ref.once("value", function (snapshot) {
//                            snapshot.forEach(function (childSnapshot){
//                                if (childSnapshot.val().title == event.title){
//                                    // here we are checking to see if the event is a recurring event
//                                    if(!childSnapshot.val().hasOwnProperty("dow")){
//                                       
//                                        ref.child(childSnapshot.key()).update({
//                                            title: event.title,
//                                            start: event.start.toString(),
//                                            end: event.end.toString(),
//                                            id: event.title + event.start.toString() + event.end.toString()}); 
//                                    } 
//                                    else{   
//                                        updateRecurringEvent(event, ref, childSnapshot);
//                                        }                              
//                                    }  
//                                });
//                        });
//                    }
//                }
        
        
/*      here we are rendering a new event so it shows immediately on the calendar instead of having to be reloaded, 
        also we are removing the event object passed in by the resize and drop methods so we dont have it show in the month view*/
//        var updateRecurringEvent = function(event, ref, childSnapshot){
//                if(event.recur== 'weekly'){
//                    recurringEventMethods().updateWeeklyEvent(event,ref);
//                }
////                if(event.recur == 'monthly'){
//////                    recurringEventMethods().updateMonthlyEvent(event,ref);
////                }
//            } 
        
        // button inside of addEventModal, called in select function inside of calendar config to get access to selected start and end time. calls createReccurringEvent() or createRegularEvent() 
        var createEvent = function (start, end, ref){
            $("#createEventButton").on("click", function (){
                var test = [];
                var eventId = $("#eventInput").val() + start.toString() + end.toString();
                userEventsRef.once("value", function (snapshot) {
                    snapshot.forEach(function (childsnapshot) {
                        test.push(childsnapshot.val().id);
                    });
                });
                
                if (test.indexOf(eventId.replace(/[\s+\*\^\.\'\!\@\:\-\$]/g, '').toLowerCase()) == -1 &&            $("#eventInput").val().length != 0){
                    if($("#dowCheckBox").prop("checked")){
                            createRecurringEvent(start,end,eventId);
                    }else{
                            createRegularEvent(start,end,eventId);
                    }
                     $("#addEventModal").css("display", "none");
                     $("#dowCheckBox").prop("checked", false);
                     $("#recur").addClass("hide");
                     $("#eventInput").val('');
                 }
                    else {
                    alert("If this event already exists or you have not a entered a value, you can not create the event");
                }   
            });

        }

        var refreshEvents = function(){
            $('#cal').fullCalendar('removeEventSource', events);
            $('#cal').fullCalendar('removeEvents');
            $('#cal').fullCalendar('addEventSource', events);
        }
        
        var recurringEventMethods = function(start, end, eventId){
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
            
            
//            var eventObj = {
//                    title:$("#eventInput").val(),
//                    range:{start:today, end:"2020/11/24"},
////                    start: start.toISOString(),
////                    end: end.toISOString(),
////                    id: eventId,
//                    recur:"weekly",
//                    eventType:"recurring event"
//            }
             
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
                 
                    updateWeeklyEvent: function(event, ref){
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
                    updateMonthlyEvent:function(event, ref){
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
                    },
                    showRecurringEventOptions: function(){
                      $("#dowCheckBox").on("click", function(){
                         $("#recur").toggleClass("hide"); 
                      });
                        $("#freq").on("change", function(){
                             if($("#freq").val()== "weekly"){
                                $("#dow").removeClass("hide");
                             }else{
                                 $("#dow").addClass('hide');
                             }
                        });
                    },
                    deleteMonthlyEvent:function(event){
                        $('#deleteMonthlyEvent').removeClass("hide");
                        $("#oneEvent").on("click", function(){
                           var eventToDelete = userEventsRef.child(event.$id) ;
                           eventToDelete.remove();
                           $("#eventDetailsModal").css("display", "none");
                        });
                        $("#allEvents").on("click",function(){
                            userEventsRef.once("value", function(datasnapshot){
                                datasnapshot.forEach(function(childsnapshot){
                                    if(childsnapshot.val().title == event.title){
                                        userEventsRef.child(childsnapshot.key()).remove();
                                    }
                                });
                            });
                        });
                    },
            
                    createDailyEvent:function(){ 
                        eventObj.dow = [0,1,2,3,4,5,6];
                        console.log(moment(start).format("YYYY/MM/DD"))
                        eventObj.recur = "daily" ;
                        checkOcc("days");
                        userEventsRef.push(eventObj);
                        console.log(eventObj.range);
                        refreshEvents();
                    },
                 
                    createWeeklyEvent: function(){
                         eventObj.dow = setDaysOfWeek(start) 
                         checkOcc("week");
                         userEventsRef.push(eventObj);
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
                              userEventsRef.push(eventObj); 
                        }
                        refreshEvents();
                     }
             }
             return meth ;
        }
        
        recurringEventMethods().showRecurringEventOptions();
        
        // creates recurring event, gets called in createEvent()
        var createRecurringEvent = function(start, end,eventId){
                    switch($("#freq").val().toLowerCase()){   
                        case "daily":  
                                recurringEventMethods(start,end,eventId).createDailyEvent();
                                break;

                        case "weekly":
                                recurringEventMethods(start,end,eventId).createWeeklyEvent();
                                break;

                        case "monthly": 
                                recurringEventMethods(start, end, eventId).createMonthlyEvent();
                                break;
            };
        }
                
        // creates a regular event in the calendar 
        var createRegularEvent = function(start, end, eventId, eventObj){
            updateIcsFile(userInfo);
            var eventObj ={
                                title:$("#eventInput").val(),
                                recur:"once",
                                start:start.toISOString(),
                                end: end.toISOString(),
                                id: eventId.replace(/[\s+\*\^\.\'\!\@\:\-\$]/g, '').toLowerCase(),
                                eventType:"regular event"
                           }
            userEventsRef.push(eventObj);   
        }
              
       
        var createMonthlyEvent = function(){
             userEventsRef.push({
                                title:$("#eventInput").val(),
                                recur:"monthly",
                                start:start.toISOString(),
                                end: end.toISOString(),
                                id: eventId.replace(/[\s+\*\^\.\'\!\@\:\-\$]/g, '').toLowerCase(),
                                eventType:"regular event"
                    });
        };
        

        // deletes the selected event from the calendar, if the event is an appointment it deletes the appointment from the students event list gets called in the event click method
        var deleteEvent = function (event, ref, usersRef) {
            $("#deleteButton").on("click", function () {
                if(event.recur == "monthly"){
                    recurringEventMethods().deleteMonthlyEvent(event);
                }
                   else{
                       var eventToDelete = userEventsRef.child(event.$id) ;
                       eventToDelete.remove();
                       $("#eventDetailsModal").css("display", "none");
                   }
                });
            }
        
        
        var updateIcsFile = function(userObj){
               $.ajax({
                            type: "POST",
                            url: "https://blooming-river-27917.herokuapp.com/work",
                            contentType:'application/json',
                            crossDomain: true,
                            dataType: "json",
                            data: JSON.stringify({
                                name:'jordan',
                                email:"jordanmamroudgmailcom"
                            }),
                            error: function(XMLHttpRequest, textStatus, errorThrown){
                                console.log(errorThrown)
                            }
                        }).done(function (dataObj) {
                            alert("ajax callback response: bame");
                        });
        };
                       

        // constructor for the users calendar settings called in saveCalSettings function
        var CalSettings = function (minTime, maxTime, googleCalendarId, synced) {
            this.minTime = minTime;
            this.maxTime = maxTime
            this.googleCalendarId = googleCalendarId ;
            this.synced = synced;
        }

        //click event for save button inside settings modal to save the users specified settings
        var saveCalSettings = function(ref){
            $scope.saveCalSettings = function () {
                var startTime = $("#calendarStartTime").val();
                var endTime = $("#calendarEndTime").val();
                var googleCalendarId = $("#googleCalendarId").val();
                
                if($('#googleSync').prop('checked')){
                    calendarConfigRef.set(new CalSettings(startTime, endTime,googleCalendarId, true));
                }else{
                    ref.set(new CalSettings(startTime, endTime,googleCalendarId, false));
                    // calling setUpCalendar here again because when the settings are changed it will update it without having torefr
                    setUpCalendar(ref);
                }
                $("#settingsModal").css("display", "none");
                }
            }
        
        //gets the pending appointment requests and shows it when the pending Request button is clicked, it is called in calendar config under custom buttons.
         var pendingRequestButtonEvent = function (list){
            list.$loaded().then(function () {
                if (list.length != 0) {
                    $("#pendingRequestsModal").css("display", "block");
                } else {
                    alert("Sorry you have no requests");
                }
            });
        }

        // alerts the student who requested the appointment that the appointment is confirmed and adds an appointment to the examiners calendar. gets called in html file with ng-click
        var approveApptRequest = function(userListRef, userEventsRef,approvedAppointmentsRef){
            $scope.approveButtonEvent = function (index) {
                console.log(index);
                var studentEmail = $scope.requestsList[index].emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '');
                var studentRef = userListRef.child(studentEmail);
               
                var studentObj = {
                        start: $scope.requestsList[index].requestedStartTime,
                        end: $scope.requestsList[index].requestedEndTime,
                        firstName: userInfo.userData.firstName,
                        lastName: userInfo.userData.lastName,
                        emailAddress: userInfo.userData.emailAddress
                }
              
                var examinerObj = {
                    start: $scope.requestsList[index].requestedStartTime,
                    end: $scope.requestsList[index].requestedEndTime,
                    emailAddress:$scope.requestsList[index].emailAddress,
                    firstName:$scope.requestsList[index].firstName,
                    lastName: $scope.requestsList[index].lastName,
                    title: "appointment with " + $scope.requestsList[index].firstName +" " + $scope.requestsList[index].lastName,
                    color: "red",
                    eventType: "approved appointment"
                }
                userInfo.$loaded().then(function (){
                    studentRef.child("upcomingAppointments").push(studentObj);
                });
                
                userEventsRef.push(examinerObj);
                approvedAppointmentsRef.push(examinerObj);
                $scope.requestsList.$remove(index);
                closeModal();
            };   
        }
        
        
        //  closes modal boxes when x button is clicked
        var closeModal = function () {
            $("span.close").on("click", function () {
                $(".modal").css("display", "none");
                $("#addEventModal").removeClass("showing");
                $("#recur").addClass("hide");
                $("#dowCheckBox").prop("checked", false);
            });
        }
        
        
 callFunctions();
}]);


// note to josh do not worry about this section 
//
//        var userListRef = new Firebase("https://checkride.firebaseio.com/users");
//        var authData = userListRef.getAuth();
//        var userEmail = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');
//        var userRef = new Firebase("https://checkride.firebaseio.com/users/" + userEmail);
//        var userCalendarRef = userRef.child("calendar");
//        var userEventsRef = userCalendarRef.child("events");
//        var userEventsRef = userCalendarRef.child("events");
//        var calendarConfigRef = userCalendarRef.child("settings");
//
//        calendarConfigRef.once("value", function(dataSnapshot){
//            if(dataSnapshot.val().synced == true){
//                // makeApiCall() is called here because we are only going to call the api if the user has chosen to sync with gCal
//                makeApiCall();
//            }
//        });
////
//    
//
//      // Your Client ID can be retrieved from your project in the Google
//      // Developer Console, https://console.developers.google.com
//      var CLIENT_ID = '373739487145-03rm8r3su52t6ps1bfdap6opa888rfvq.apps.googleusercontent.com';
//      var SCOPES = "https://www.googleapis.com/auth/calendar";
//
//			// date variables
//			var now = new Date();
//			today = now.toISOString();
//			
//			var twoHoursLater = new Date(now.getTime() + (2*1000*60*60));
//			twoHoursLater = twoHoursLater.toISOString();
//			
//			// google api console clientID and apiKey (https://code.google.com/apis/console/#project:568391772772)
//			var clientId = '373739487145-03rm8r3su52t6ps1bfdap6opa888rfvq.apps.googleusercontent.com';
//			var apiKey = 'AIzaSyA0IwuIvriovVNGQiaN-q2pKYIpkWqSg0c';
//
//			// enter the scope of current project (this API must be turned on in the google console)
//			var scopes = 'https://www.googleapis.com/auth/calendar';
//
//
//			// Oauth2 functions
//			function handleClientLoad() {
//				gapi.client.setApiKey(apiKey);
//				window.setTimeout(checkAuth,1);
//			}
//
//			function checkAuth() {
//				gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
//			}
//
//			// show/hide the 'authorize' button, depending on application state
//			function handleAuthResult(authResult) {
//				var authorizeButton = document.getElementById('authorize-button');
//				var resultPanel		= document.getElementById('result-panel');
//				var resultTitle		= document.getElementById('result-title');
//				
//				if (authResult && !authResult.error) {						
//					authorizeButton.style.visibility = 'hidden';			// if authorized, hide button
//					resultPanel.className = resultPanel.className.replace( /(?:^|\s)panel-danger(?!\S)/g , '' )	// remove red class
//					resultPanel.className += ' panel-success';				// add green class
//					resultTitle.innerHTML = 'Application Authorized'		// display 'authorized' text
//				} else {													// otherwise, show button
//					authorizeButton.style.visibility = 'visible';
//					resultPanel.className += ' panel-danger';				// make panel red
//					authorizeButton.onclick = handleAuthClick;				// setup function to handle button click
//				}
//			}
//			
//			// function triggered when user authorizes app
//			function handleAuthClick(event) {
//				gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
//				return false;
//			}
//			
//			// setup event details
//  
//			// function load the calendar api and make the api call
//			function makeApiCall() {
//                userEventsRef.once("value", function(dataSnapshot){
//                   dataSnapshot.forEach(function(childSnapshot){
//                   	gapi.client.load('calendar', 'v3', function() {	
//                        var resource = {
//                        "summary": childSnapshot.val().start + " " + childSnapshot.val().title,
//                        "start": {
//                            "dateTime": childSnapshot.val().start,
//                            "timeZone":"America/New_York"
//                        },
//                        "end": {
//                            "dateTime": childSnapshot.val().end,
//                            "timeZone":"America/New_York"
//                        },
//                        visibility:"confidential",
//                        readOnly:true,
//                            creator:{
//                                self:false
//                            },
//                        iCalUID:"19960401T080045Z-4000F192713-0052@gmail.com"
//                        
//                    };// load the calendar api (version 3)
////                            var request = gapi.client.calendar.events.insert({
////                                'calendarId':		'jordanmamroud@gmail.com',	// calendar ID
////                                "resource":			resource							// pass event details with api call
////                            });
//                        
//                        var b = gapi.client.calendar.events.import({
//                            calendarId:'jordanmamroud@gmail.com',
//                            resource: resource
//                        });
//                        
//                    
//
//					// handle the response from our api call
//					b.execute(function(resp) {
//						if(resp.status=='confirmed') {
//							document.getElementById('event-response').innerHTML = "Event created successfully. View it <a href='" + resp.htmlLink + "'>online here</a>.";
//						} else {
//							document.getElementById('event-response').innerHTML = "There was a problem. Reload page and try again.";
//						}
//						/* for (var i = 0; i < resp.items.length; i++) {		// loop through events and write them out to a list
//							var li = document.createElement('li');
//							var eventInfo = resp.items[i].summary + ' ' +resp.items[i].start.dateTime;
//							li.appendChild(document.createTextNode(eventInfo));
//							document.getElementById('events').appendChild(li);
//						} */
//						console.log(resp);
//					       });
//				        });
//					   });
//                   }); 
//                }
//

	// load the calendar api (version 3)
//					var request = gapi.client.calendar.events.insert({
//						'calendarId':		'jordanmamroud@gmail.com',	// calendar ID
//						"resource":			resource							// pass event details with api call
//					});
//					
//					// handle the response from our api call
//					request.execute(function(resp) {
//						if(resp.status=='confirmed') {
//							document.getElementById('event-response').innerHTML = "Event created successfully. View it <a href='" + resp.htmlLink + "'>online here</a>.";
//						} else {
//							document.getElementById('event-response').innerHTML = "There was a problem. Reload page and try again.";
//						}
//						/* for (var i = 0; i < resp.items.length; i++) {		// loop through events and write them out to a list
//							var li = document.createElement('li');
//							var eventInfo = resp.items[i].summary + ' ' +resp.items[i].start.dateTime;
//							li.appendChild(document.createTextNode(eventInfo));
//							document.getElementById('events').appendChild(li);
//						} */
//						console.log(resp);
//					});
//				});
			


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