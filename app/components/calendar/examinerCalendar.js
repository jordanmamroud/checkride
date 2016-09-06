var app = angular.module('crCalendar', ['ui.calendar', 'firebase', 'crCalendar.service', 'calDir']);
        // takes the users saved calendar settings from db and adds events in events[] to calendar  
//        var setUpCalendar = function (calendarConfigRef) {
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


app.controller("examinerCalendarController",  ['$window','$scope', '$firebaseArray', '$firebaseObject', '$compile', 'uiCalendarConfig','commonServices',"calendarService",
      function ($window,$scope, $firebaseArray, $firebaseObject, $compile, uiCalendarConfig, commonServices, calendarService){
        var vm = this ;  
          

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
        var test=[];  
        var events = $firebaseArray(userEventsRef);
        var approvedApointments = $firebaseArray(approvedAppointmentsRef);
        var userInfo = $firebaseObject(userRef);
          
        
        var today = moment(vm.eventStart).format('YYYY/MM/DD').replace(/-/g, "/");
          
        vm.requestsList = $firebaseArray(appointmentRequestsListRef);
        vm.dowCheckBox= false ;
        vm.frequency = 'daily';
        vm.calStartTime = 0 ;
        vm.calStartTime = "00:00:00";
        vm.calEndTime = "24:00:00";
        vm.gcalId = null ;
        vm.eventTitle =''; 
        vm.endDate = '';
      

        vm.saveCalSettings =function(){
                calendarService.saveCalSettings(vm.calStartTime , vm.calEndTime, vm.gcalId, userCalendarRef);
                console.log(vm.calEndTime);
        }

        vm.approveAppointment = function(index) {
            calendarService.approveAppointment(vm.requestsList,index ,userListRef, userEventsRef ,approvedAppointmentsRef,userInfo);
        };
          
        userInfo.$loaded().then(function(){
           vm.name = userInfo.userData.firstName +" " + userInfo.userData.lastName ;
        });
          
           /* calendarService.syncGcal(calSettingsInfo, $scope.uiConfig.calendar.events.googleCalendarId);*/
        commonServices.showToastOnEvent(appointmentRequestsListRef,"child_added");
        commonServices.orderArray($scope.requestsList, "-sentAt")
    
        
        $scope.eventSources = [];
            $scope.uiConfig = {
                calendar: {
//                    googleCalendarApiKey: 'AIzaSyA0IwuIvriovVNGQiaN-q2pKYIpkWqSg0c',
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
                                pendingRequestButtonEvent(vm.requestsList);
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
                        vm.eventStartObj = start ;
                        vm.eventEndObj = end ;
                        vm.eventStart = start.toString() ;
                        vm.eventEnd = end.toString() ;  
                    },
                    editable: true,
                    eventClick: function (event, element) {
                        calendarService.eventClick(event,userEventsRef,approvedAppointmentsRef, "#deleteButton");
                    },
                    eventDrop: function ( event , element) {
                        calendarService.onEventChange(event, userEventsRef);
                    },
                    eventResize: function (event , element) {
                        calendarService.onEventChange(event, userEventsRef);
                    },
                    eventRender: function(event,element,view){  
                        if(event.recur != "once" && event.hasOwnProperty("range")){
                                var eventDate = moment(event.start).format("YYYY/MM/DD");
                                if(event.range.start > eventDate || event.range.end < eventDate){
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
                var pendingRequestButtonEvent = function (list){
                    list.$loaded().then(function () {
                        if (list.length != 0) {
                            $("#pendingRequestsModal").addClass("showing");
                        } else {
                            alert("Sorry you have no requests");
                        }
                    });
                }
      }]);
  

//          appointmentRequestsListRef.push({
//                    requestedStartTime:"03:00:00",
//                    requestedEndTime:"09:00:00",
//                    emailAddress:"jane@yahoo.com",
//                    firstName: "jane",
//                    lastName:"mamroud",
//                    title: "bane",
//                    color: "red",
//                    eventType: "approved appointment"
//          })
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