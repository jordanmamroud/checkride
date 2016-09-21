angular.module("calDir", ['ui.calendar', 'crCalendar.service', 'firebase'])

.directive('calDirective', function(){
   
    return{
        templateUrl: function() {
            return 'app/components/calendar/cal.html?' +  new Date();
        },    
        scope:{
            myid:"@",
            eventStartObj:"=",
            eventEndObj:"=",
            clickedEvent:"="
        },
        controllerAs:"ev", 
        controller:function($scope, calendarService, $mdDialog, pcServices){
            var ev = this;
//<<<<<<< HEAD
//            var refs = pcServices.getCommonRefs() ;
////            var userInfo = $scope.$parent.$resolve.currentUser ;
//            var userInfo = pcServices.getCookieObj("currentUser");
//=======
            var refs = pcServices.getCommonRefs();
            var userInfo = pcServices.getCookieObj('user');
            var userRef = refs.accounts.child(userInfo.$id);
            var userCalendarRef = refs.calendars.child(userInfo.$id);
            var userEventsRef =  userCalendarRef.child("events");
            var approvedAppointmentsRef = userCalendarRef.child("approvedAppointments");
            var calendarSettings= userCalendarRef.child("settings");
            var appointmentSlotsRef = userCalendarRef.child('appointmentSlots');
            
            ev.events = pcServices.createFireArray(userEventsRef);
            ev.approvedApointments = pcServices.createFireArray(approvedAppointmentsRef);        
            ev.requestsList = pcServices.createFireArray(userCalendarRef.child("appointmentRequests"));
            ev.calStartTime = 0 ;
            ev.calStartTime = "00:00:00";
            ev.calEndTime = "24:00:00";
            ev.gcalId = null ;
            ev.repeatingEvent = false;
            ev.frequency = 'daily';
            ev.eventTitle =''; 
            ev.endRange = '2020/11/02';
            ev.numOccur = 0 ;
            ev.monthlyEvent = false ;
            ev.repeatForm={};
            ev.dow="";
            ev.daysOfWeek = [{day:'sunday',val:0},{day:'monday',val:1},{day:'tuesday',val:2},{day:'wednesday',val:3},{day:'thursday',val:4},{day:'friday',val:5},{day:'saturday',val:6}]
            
            ev.createEvent = createEvent ;
            
            ev.deleteEvent = deleteEvent;
            ev.deleteSingleMonthlyEvent = deleteSingleMonthlyEvent;
            ev.deleteAllMonthlyEvents = deleteAllMonthlyEvents;
            ev.saveCalSettings = saveCalSettings; 
            ev.approveAppointment = approveAppointment ;
            pcServices.showToastOnEvent(userCalendarRef.child("appointmentRequests"),"child_added");
            pcServices.orderArray($scope.requestsList, "-sentAt");
            ev.name = userInfo.name.first + " " +userInfo.name.last ;
        
            var onSelect = function(){
                $mdDialog.show({
                    scope:$scope.$new(),
                    templateUrl:'addEventModal',    
                    clickOutsideToClose:true
                });
            }

            var eventClick =function(){
                $mdDialog.show({
                    scope:$scope.$new(),
                    templateUrl:'eventDetailsModal',
                    clickOutsideToClose:true
                })
            };
            
            var showSettings = function(){
                $mdDialog.show({
                    scope:$scope.$new(),
                    templateUrl:'settingsModal',
                    clickOutsideToClose:true
                })
            };
            
            var getAppointmentRequest = function(){
                if(ev.requestsList.length !=0){
                    $mdDialog.show({
                        scope:$scope.$new(),
                        templateUrl:'pendingRequestsModal',
                        clickOutsideToClose:true
                    })
                }else{
                    alert('You have no appointmentRequests')
                }
            };
            
            function createEvent(){
                  var today = ev.eventStartObj.format('YYYY/MM/DD').replace(/-/g, "/");
                  var eventId= userRef.push().key();
                  var eventObj = new calendarService.Event(ev.eventTitle,ev.eventStartObj,{start:today, end:"2020/02/01"},ev.eventEndObj,'once', eventId, null, null,null,null);
                  if(ev.repeatingEvent){
                        switch(ev.frequency.toLowerCase()){   
                            case "daily":       
                                    calendarService.setEventRange(ev.repeatForm, eventObj, "days");
                                    calendarService.createDailyEvent(eventObj,userEventsRef);
                                    break;
                            case "weekly":
                                    eventObj.dow = calendarService.setDaysOfWeek(ev.daysOfWeek, ev.eventStartObj);
                                    calendarService.setEventRange(ev.repeatForm, eventObj, "week");
                                    calendarService.createWeeklyEvent(eventObj,userEventsRef);
                                    break;
                            case "monthly": 
                                    calendarService.createMonthlyEvent(eventObj, userEventsRef, calendarService.setAmtOfMonths(ev.repeatForm, ev.eventStartObj));
                                    break;
                        };
                    }else{
                        calendarService.createRegularEvent(eventObj, userEventsRef);
                    }   
                    ev.repeatingEvent = false;
                    $mdDialog.cancel();
            }
           
        
            function deleteEvent(){
                 if(ev.clickedEvent.recur == "monthly"){
                        ev.monthlyEvent = true ;
                    }
                    else{
                        userEventsRef.child(ev.clickedEvent.$id).remove() ;
                        $mdDialog.cancel();
                   }
            }
            
           function deleteSingleMonthlyEvent(){
                    userEventsRef.child(ev.clickedEvent.$id).remove();
                    ev.monthlyEvent = false ;
                    $mdDialog.cancel();
            }
                        
        
           function deleteAllMonthlyEvents(){
                calendarService.deleteAllMonthlyEvents(ev.clickedEvent, userEventsRef);
                ev.monthlyEvent = false ;
                $mdDialog.cancel();
            };
            
            function saveCalSettings(){
                calendarService.saveCalSettings(ev.calStartTime , ev.calEndTime, ev.gcalId, userCalendarRef);
            };

            function approveAppointment(apt) {
                calendarService.approveAppointment(apt,userInfo);
                console.log(ev.events);
            };
               
            function setUpCalendar(){
                calendarSettings.on("value", function(data){
                    ev.uiConfig.calendar.minTime = data.val().minTime ;
                    ev.uiConfig.calendar.maxTime = data.val().maxTime ;
                });
            }
            setUpCalendar();
           
            ev.eventSources = [];
                ev.uiConfig = {
                    calendar: {
    //                    googleCalendarApiKey: 'AIzaSyA0IwuIvriovVNGQiaN-q2pKYIpkWqSg0c',
                        events: ev.events,
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
                                    getAppointmentRequest();
                                }
                            },
                            settingsButton: {
                                text: 'Settings',
                                click: function () {
                                    showSettings();
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
                        select: function (start, end) {
                            onSelect();
                            ev.eventStartObj = start ;
                            ev.eventEndObj = end ;
                            console.log(ev);
                        },
                        editable: true,
                        eventClick: function (event, element) {
                            ev.clickedEvent = event ;
                            eventClick();
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
                        }
                    }  
                }
            }
        }
})

.directive('viewingCal',function(){
    return{
        templateUrl:function() {
            return 'app/components/calendar/viewCal.html?' +  new Date();
        }, 
        controllerAs:'vc',
        controller: ['$scope', '$mdDialog','pcServices', 'calendarService',function ($scope, $mdDialog, pcServices, calendarService){
            var refs = pcServices.getCommonRefs();
            var examinerInfo = pcServices.getCookieObj("examinerInfo");
/*
<<<<<<< HEAD
*/
             var userInfo = pcServices.getCookieObj("user");
            
            var examinerRef = refs.accounts.child(examinerInfo.$id) ;
            var examinerCalRef = refs.calendars.child(examinerInfo.$id) ;
            var settingsRef = examinerRef.child("calendar/settings") ;
            var eventsList = pcServices.createFireArray(examinerCalRef.child("events")) ;
            
            this.aicrCats = pcServices.createFireArray(refs.root.child("config/aircraft-category"));
            this.ratings = pcServices.createFireArray(refs.root.child("config/ratings"));
            this.aicrCategory='';
            this.rating='';
            this.examinerName = examinerInfo.data.name.first +" " + examinerInfo.data.name.last ;
            this.sendRequest = sendRequest ;
            
            function sendRequest(){
                var examinerCalRef = refs.calendars.child(examinerInfo.$id);                
                var appointment = new calendarService.Appointment(userInfo.name.first+" "+ userInfo.name.last,$scope.eventStart,$scope.eventEnd, userInfo.$id, this.aicrCategory.$value, this.rating.$value);
				var examinerRequestListRef = examinerCalRef.child("appointmentRequests").push(appointment);
                refs.notifications.child(examinerInfo.$id).push("appointment Request from " + userInfo.name.first + ' ' + userInfo.name.last);
                $mdDialog.hide();
/*=======
            var userInfo = pcServices.getCookieObj("user");
            var examinerRef = refs.accounts.child(examinerInfo.$id);
            var examinerCalRef = refs.calendars.child(examinerInfo.$id);

            var settingsRef = examinerRef.child("calendar/settings");
            var eventsList = pcServices.createFireArray(examinerCalRef.child("events"));
            $scope.examinerName = examinerInfo.data.name.first +" " + examinerInfo.data.name.last ;
            $scope.sendRequest = function(){
                var examinerCalRef = refs.calendars.child(examinerInfo.$id);
                calendarService.sendAppointmentRequest(examinerCalRef, userInfo,$scope.eventStart, $scope.eventEnd);
>>>>>>> c14467f705ed978789fef30f4c64ee6b32ebcf33*/
            }
            
            $scope.eventSources = [];
            function showApptDialog (){
                $mdDialog.show({
                    scope:$scope.$new(),
                    templateUrl:"requestModal",
                    clickOutsideToClose:true,
                })
            }
            
            $scope.uiConfig = {
                calendar: {
        //                googleCalendarApiKey: 'AIzaSyA0IwuIvriovVNGQiaN-q2pKYIpkWqSg0c',

                    events: eventsList,
                    height: '100%',
                    snapDuration:"02:00:00",
                    timezone: "local",
                    editable: true,
                    defaultView: 'agendaWeek',
                    header: {
                        left: 'month agendaWeek  agendaDay ',
                        center: 'title',
                        right: 'Today prev,next settingsButton'
                    },
                    selectable: true,
                    selectable: {
                        month: true,
                        agenda: true
                    },
                    unselectAuto: true,
                    select: function (start, end, ev) {
                        $scope.eventStart = start.toString();
                        $scope.eventEnd = end.toString();
                        
                        showApptDialog();
                        console.log('vain bane')

                    },
                    editable: false,
                    eventClick: function (event, element){
//                        $scope.eventStart = event.start.toString();
//                        $scope.eventEnd = event.end.toString();
//                        $scope.showApptDialog();
                        // stops gcal events from going to google calendar
                          if (event.url) {
                            console.log("event",event);
                            return false;
                        }
                    }
                }
            }; 
        }]
    }
})