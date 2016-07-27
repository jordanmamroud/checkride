var app = angular.module('myApp', ['ui.calendar', 'firebase','examinerDirectives']);



app.controller('calendarController', ['$window','$scope', '$firebaseArray', '$firebaseObject', '$compile', 'uiCalendarConfig',
                                 function ($window,$scope, $firebaseArray, $firebaseObject, $compile, uiCalendarConfig) {
   


        var userListRef = new Firebase("https://checkride.firebaseio.com/users");
        var authData = userListRef.getAuth();
        var userEmail = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');
        var userRef = new Firebase("https://checkride.firebaseio.com/users/" + userEmail);
        var userCalendarRef = userRef.child("calendar");
        var userEventsRef = userCalendarRef.child("events");
        var events = $firebaseArray(userEventsRef);
        var approvedAppointmentsRef = userCalendarRef.child("approvedAppointments");
        var approvedApointments = $firebaseArray(approvedAppointmentsRef);
        var calendarConfigRef = userCalendarRef.child("settings");
        
//        $(document).ready(function() {
//    $('#calendar').fullCalendar({
//        googleCalendarApiKey: 'AIzaSyC9O4GTl5pR7ZOPeA6Lj5U29WLA6_jeun4',
//        events: {
//            googleCalendarId: 'abcd1234@group.calendar.google.com'
//        }
//    });
//});
//                $(document).ready(function() {
//        $('#cal').fullCalendar({
//            eventSources:[ 
//            { 
//                            url: "https://calendar.google.com/calendar/embed?src=jordanmamroud%40gmail.com&ctz=America/New_York",
//                            
//                            color: '#3a87ad'
//            }]
//        });
//    });             
//            $scope.eventSource = {
//            url: "https://calendar.google.com/calendar/embed?src=jordanmamroud%40gmail.com&ctz=America/New_York",
//            className: 'gcal-event',           // an option!
//            currentTimezone: 'America/Chicago' // an option!
//    };                             
//                                     
//                                     console.log($scope.eventSource);
//                                     
                                     
                                     
                                     
        // the requests list is a list of all student appointment request for the logged in examiner                             
        $scope.requestsList = $firebaseArray(userRef.child("appointmentRequests"));
        userRef.child("appointmentRequests").on("child_added", function (datasnapshot){
                            $('.toast').fadeIn(400).delay(3000).fadeOut(400);
        });
        // username object is used to set the user name in the top left corner of navbar                             
        var userName = $firebaseObject(userRef);                             
        userName.$loaded().then(function(){
           $("#userName").text(userName.userData.firstName + " " + userName.userData.lastName); 
        });
        var settingsData = $firebaseObject(calendarConfigRef);
         settingsData.$loaded().then(function(){
             $scope.uiConfig.calendar.events.googleCalendarId = settingsData.googleCalendarId ;
             $scope.uiConfig.calendar.events.googl
         });
                                     
         // event sources is where the calendar is pulling all of its events from.                            
        $scope.eventSources = [events, approvedApointments];                       
        // ui config where we set up all of our calendar configurations    
                                     
         
                                     
        $scope.uiConfig = {
            calendar: {
                googleCalendarApiKey: 'AIzaSyA0IwuIvriovVNGQiaN-q2pKYIpkWqSg0c',
                // reason why events is empty is because it needs to be added as a property to later access it to add the gcal events from settings data
                    events: {
                        
                    },
                timezone:"local",
                height: '100%',
                editable: true,
                allDaySlot:false,
                snapDuration:"02:00:00",
                customButtons: {
                    pendingRequestsButton: {
                        text: 'Pending Requests',
                        click: function () {
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
                    createEvent(start, end, userEventsRef);
                },
                editable: true,
                eventClick: function (event, element) {
                    $("#eventTitle").text("Event: " + event.title);
                    $("#eventDetailsModal #eventStart").text("start: " + event.start.toISOString());
                    $("#eventDetailsModal #eventEnd").text("end: " + event.end.toISOString());
                    $("#eventDetailsModal").css("display", "block");
                    deleteRegularEvent(event, userEventsRef);
                    deleteRegularEvent(event, approvedAppointmentsRef);
                },
                eventDrop: function (event, element) {
                    onEventChange(event, element, userEventsRef);
                },
                eventResize: function (event, element) {
                    onEventChange(event, element, userEventsRef);
                },
                eventRender: $scope.eventRender
            }
        };
                
        //    //  gets all the events from the db 
        //         var events = $firebaseArray(eventsRef);
        //         $scope.eventSources = [events];
        //         console.log(events);
        // takes the users saved calendar settings from db and adds events in events[] to calendar  
        var setUpCalendar = function (fireRef) {
            fireRef.on("value", function (snapshot) {
                var startTime = snapshot.val().minTime;
                var endTime = snapshot.val().maxTime;
                $scope.uiConfig.calendar.minTime = startTime.toString();
                $scope.uiConfig.calendar.maxTime = endTime.toString();
                $("#loggedInUser").text(userEmail);
            });
        }
        setUpCalendar(calendarConfigRef);
                                     
        //when a event gets changed this updates the event in the database
        var onEventChange = function (event, element, fireRef,obj) {
                for (var i = 0; i < events.length; i++) {
                    if (event.title == events[i].title) {
                        events[i].start = event.start.toISOString();
                        events[i].end = event.end.toISOString();
                        fireRef.once("value", function (snapshot) {
                            snapshot.forEach(function (childSnapshot) {
                                if (childSnapshot.val().title == event.title){
                                    // here we are checking to see if the event is a recurring event
                                    console.log(childSnapshot.val().hasOwnProperty("dow"));
                                    if(!childSnapshot.val().hasOwnProperty("dow")){
                                    fireRef.child(childSnapshot.key()).update({
                                        title: event.title,
                                        start: event.start.toString(),
                                        end: event.end.toString(),
                                        id: event.title + event.start.toString() + event.end.toString()});
                                    }
                                    else{
                                        console.log(new Date(event.start).toTimeString().substring(0,8));
                                        fireRef.child(childSnapshot.key()).update({
                                        title: event.title,
                                        start: new Date(event.start).toTimeString().substring(0,8),
                                        end: new Date(event.end).toTimeString().substring(0,8),
                                        id: event.title + event.start.toString() + event.end.toString()});
                                        $("#cal").fullCalendar("refetchEvents");
                                    }
                                }
                            });
                        });
                    }
                }
            }
            // button inside of addEventModal, called in select function inside of calendar config to get access to selected start and end time  
        var createEvent = function (start, end, fireRef) {
            $("#createEventButton").on("click", function () {
                var test = [];
                var eventId = $("#eventInput").val() + start.toString() + end.toString();
                fireRef.once("value", function (snapshot) {
                    snapshot.forEach(function (childsnapshot) {
                        test.push(childsnapshot.val().id);
                    });
                });
               //this is for creating a recurring event, that shows in all views. 
                if($("#dowCheckBox").prop("checked")){
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
                    // the reason that the substring cuts of the time string after 8 characters is because the full calendar will only add repeating events to the week view if it is just the the time like so 08:00:00.
                     fireRef.push({
                                title:$("#eventInput").val(),
                                start: new Date(start).toTimeString().substring(0,8),
                                end: new Date(end).toTimeString().substring(0,8),
                                id: eventId,
                                dow: daysOfWeek
                        });
                   }
                else{
                        if (test.indexOf($("#eventInput").val() + start.toString() + end.toISOString()) == -1 && $("#eventInput").val().length != 0) {
                            addEventsToGcal(start,end);
                            fireRef.push({
                                        title:$("#eventInput").val(),
                                        start: start.toISOString(),
                                        end: end.toISOString(),
                                        id: eventId
                            });
                            closeModal();
                            $("#eventInput").val('');

                        } else {
                            alert("Please make sure you have entered an event");
                        }   
                   }
            });
        }

        // deletes the selected event from the calendar , gets called in the event click method
        var deleteRegularEvent = function (event, fireRef) {
            $("#deleteButton").on("click", function () {
                fireRef.once("value", function (dataSnapshot){
                     if(event.hasOwnProperty("emailAddress")){
                         dataSnapshot.forEach(function(childSnapshot){
                            if(childSnapshot.val().hasOwnProperty("emailAddress")){
                                console.log(childSnapshot.val().emailAddress.replace(/[\*\^\.\'\!\@\$]/g, ''));
                                var studentRef = userListRef.child(childSnapshot.val().emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '') + "/upcomingAppointments"); 
                                studentRef.once("value", function(dataSnapshot){
                                   dataSnapshot.forEach(function(childr){
                                      if(childSnapshot.val().start == childr.val().start){
                                          console.log(childr.val());
                                          var apptToDelete = studentRef.child(childr.key());
                                          var examinerApptToDelete = fireRef.child(childSnapshot.key());
                                          apptToDelete.remove();
                                          examinerApptToDelete.remove();
                                          $("#cal").fullCalendar('refetchEventSources', events);
                                          $("#eventDetailsModal").css("display", "none");
                                      } 
                                   });
                                });
                            }
                         }); 
                   }else{
                    dataSnapshot.forEach(function (childSnapshot) {
                        if (childSnapshot.val().title.toLowerCase() == event.title.toLowerCase()){
                            var eventToDelete = fireRef.child(childSnapshot.key());
                            eventToDelete.remove();
                            $("#cal").fullCalendar('refetchEventSources', events);
                            $("#eventDetailsModal").css("display", "none");
                        }
                    });
                   }
                });
            });
        }
        
//        var deleteAppointment = function(event, fireRef){
//            $("#deleteButton").on("click", function(){
//               fireRef.once("value", function(dataSnapshot){
//                  dataSnapshot.forEach(function(childSnapshot){
//                      console.log(childSnapshot.val().emailAddress.replace(/[\*\^\.\'\!\@\$]/g, ''));
//                     if(childSnapshot.val().title.toLowerCase() == event.title.toLowerCase()){
//                         console.log(childSnapshot.val());
//                         var studentRef = userListRef.child(childSnapshot.val().emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '').upcomingAppointments);
////                         studentRef.once("value", function(dataSnapshot){
////                             dataSnapshot.forEach(function(childSnapshot){
////                               console.log(dataSnaphsot.val());
////                             });
////                         });
//                     }
//                  });
//               });
//            });
//        }

        //  closes modal boxes
        var closeModal = function () {
            $(".modal").css("display", "none");
            $("span.close").on("click", function () {
                $(".modal").css("display", "none");
                $("#addEventModal").removeClass("showing");
            });
        }
        closeModal();


        // constructor for the users calendar settings called in saveCalSettings function
        var userCalSettings = function (minTime, maxTime, googleCalendarId) {
            this.minTime = minTime;
            this.maxTime = maxTime
            this.googleCalendarId = googleCalendarId ;
        }

        //click event for save button inside settings modal to save the users specified settings
        $scope.saveCalSettings = function () {
            var startTime = $("#calendarStartTime").val();
            var endTime = $("#calendarEndTime").val();
            var googleCalendarId = $("#googleCalendarId").val();
            if (startTime.length == 0 || endTime.length == 0) {
                alert("please enter values for start and end times");
            } else {
                calendarConfigRef.set(new userCalSettings(startTime, endTime,googleCalendarId));
                setUpCalendar(calendarConfigRef);
                closeModal();
            }
        }
    
        //gets the pending appointment requests and shows it when the pending Request button is clicked, it is clicked in calendar config under custom buttons.

        var pendingRequestButtonEvent = function (list) {
            list.$loaded().then(function () {
                if (list.length != 0) {
                    $("#pendingRequestsModal").css("display", "block");
                } else {
                    alert("Sorry you have no requests");
                }
            });
        }

        // alerts the student who requested the appointment that the appointment is confirmed and adds an appointment to the examiners calendar. gets called in html file with ng-click
        $scope.approveButtonEvent = function (index) {
            var studentEmail = $scope.requestsList[index].emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '');
            var studentRef = userListRef.child(studentEmail);
            var examinerInfo = $firebaseObject(userRef);
            examinerInfo.$loaded().then(function (){
                studentRef.child("upcomingAppointments").push({
                    start: $scope.requestsList[index].requestedStartTime,
                    end: $scope.requestsList[index].requestedEndTime,
                    firstName: examinerInfo.userData.firstName,
                    lastName: examinerInfo.userData.lastName,
                    emailAddress: examinerInfo.userData.emailAddress
                });
            });
//            studentRef.child("upcomingAppointments").push({
//                start: $scope.requestsList[index].requestedStartTime,
//                end: $scope.requestsList[index].requestedEndTime,
//                firstName:$scope.requestsList[index].firstName,
//                lastName:$scope.requestsList[index].lastName,
//                title: "appointment with " + $scope.requestsList[index].student
//            });
            approvedAppointmentsRef.push({
                start: $scope.requestsList[index].requestedStartTime,
                end: $scope.requestsList[index].requestedEndTime,
                emailAddress:$scope.requestsList[index].emailAddress,
                firstName:$scope.requestsList[index].firstName,
                lastName: $scope.requestsList[index].lastName,
                title: "appointment with " + $scope.requestsList[index].firstName +" " + $scope.requestsList[index].lastName,
                color: "red"
            });
            $scope.requestsList.$remove(index);
            closeModal();
        };                                                                
}]);


// note to josh do not worry about this section 
        var userListRef = new Firebase("https://checkride.firebaseio.com/users");
        var authData = userListRef.getAuth();
        var userEmail = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');
        var userRef = new Firebase("https://checkride.firebaseio.com/users/" + userEmail);
        var userCalendarRef = userRef.child("calendar");
        var userEventsRef = userCalendarRef.child("events");
      

      
      // Your Client ID can be retrieved from your project in the Google
      // Developer Console, https://console.developers.google.com
      var CLIENT_ID = '373739487145-03rm8r3su52t6ps1bfdap6opa888rfvq.apps.googleusercontent.com';
      var SCOPES = "https://www.googleapis.com/auth/calendar";

			// date variables
			var now = new Date();
			today = now.toISOString();
			
			var twoHoursLater = new Date(now.getTime() + (2*1000*60*60));
			twoHoursLater = twoHoursLater.toISOString();
			
			// google api console clientID and apiKey (https://code.google.com/apis/console/#project:568391772772)
			var clientId = '373739487145-03rm8r3su52t6ps1bfdap6opa888rfvq.apps.googleusercontent.com';
			var apiKey = 'AIzaSyA0IwuIvriovVNGQiaN-q2pKYIpkWqSg0c';

			// enter the scope of current project (this API must be turned on in the google console)
			var scopes = 'https://www.googleapis.com/auth/calendar';


			// Oauth2 functions
			function handleClientLoad() {
				gapi.client.setApiKey(apiKey);
				window.setTimeout(checkAuth,1);
			}

			function checkAuth() {
				gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
			}

			// show/hide the 'authorize' button, depending on application state
			function handleAuthResult(authResult) {
				var authorizeButton = document.getElementById('authorize-button');
				var resultPanel		= document.getElementById('result-panel');
				var resultTitle		= document.getElementById('result-title');
				
				if (authResult && !authResult.error) {						
					authorizeButton.style.visibility = 'hidden';			// if authorized, hide button
					resultPanel.className = resultPanel.className.replace( /(?:^|\s)panel-danger(?!\S)/g , '' )	// remove red class
					resultPanel.className += ' panel-success';				// add green class
					resultTitle.innerHTML = 'Application Authorized'		// display 'authorized' text
					makeApiCall();											// call the api if authorization passed
				} else {													// otherwise, show button
					authorizeButton.style.visibility = 'visible';
					resultPanel.className += ' panel-danger';				// make panel red
					authorizeButton.onclick = handleAuthClick;				// setup function to handle button click
				}
			}
			
			// function triggered when user authorizes app
			function handleAuthClick(event) {
				gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
				return false;
			}
			
			// setup event details
		
        console.log(today);
  
			// function load the calendar api and make the api call
			function makeApiCall() {
                userEventsRef.once("value", function(dataSnapshot){
                   dataSnapshot.forEach(function(childSnapshot){
                   	gapi.client.load('calendar', 'v3', function() {		
                        var resource = {
                        "summary": childSnapshot.val().title,
                        "start": {
                            "dateTime": childSnapshot.val().start
                        },
                        "end": {
                            "dateTime": childSnapshot.val().end
                        }
                    };// load the calendar api (version 3)
                            var request = gapi.client.calendar.events.insert({
                                'calendarId':		'jordanmamroud@gmail.com',	// calendar ID
                                "resource":			resource							// pass event details with api call
                            });
					
					// handle the response from our api call
					request.execute(function(resp) {
						if(resp.status=='confirmed') {
							document.getElementById('event-response').innerHTML = "Event created successfully. View it <a href='" + resp.htmlLink + "'>online here</a>.";
						} else {
							document.getElementById('event-response').innerHTML = "There was a problem. Reload page and try again.";
						}
						/* for (var i = 0; i < resp.items.length; i++) {		// loop through events and write them out to a list
							var li = document.createElement('li');
							var eventInfo = resp.items[i].summary + ' ' +resp.items[i].start.dateTime;
							li.appendChild(document.createTextNode(eventInfo));
							document.getElementById('events').appendChild(li);
						} */
						console.log(resp);
					});
				});
					});
                   }); 
                }
//				gapi.client.load('calendar', 'v3', function() {					// load the calendar api (version 3)
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