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
        controller:function($scope,$firebaseArray,$firebaseObject , calendarService, $mdDialog,commonServices){
            var ev = this;
            var usersRef = commonServices.getCommonRefs().usersRef;
            var userInfo = commonServices.getCookieObj('currentUser');
            var userEmail = userInfo.emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '');                        
            var userRef = usersRef.child(userEmail);
            var userCalendarRef = userRef.child("calendar");
            var userEventsRef = userCalendarRef.child("events");
            var userCalendarRef = userRef.child("calendar");          
            var approvedAppointmentsRef = userCalendarRef.child("approvedAppointments");
            var calendarSettings= userCalendarRef.child("settings");
            var appointmentRequestsListRef = userRef.child("appointmentRequests");                 
            var test=[];  
            var events = commonServices.createFireArray(userEventsRef);
            var approvedApointments = commonServices.createFireArray(approvedAppointmentsRef);
            
            
            ev.requestsList = $firebaseArray(appointmentRequestsListRef);
            ev.calStartTime = 0 ;
            ev.calStartTime = "00:00:00";
            ev.calEndTime = "24:00:00";
            ev.gcalId = null ;
            ev.dowCheckBox= false ;
            ev.frequency = 'daily';
            ev.eventTitle =''; 
            ev.endRange = '2020/11/02';
            ev.numOccur = 0 ;
            ev.monthlyEvent = false ;
            ev.repeatForm={};
            
            commonServices.showToastOnEvent(appointmentRequestsListRef,"child_added");
            commonServices.orderArray($scope.requestsList, "-sentAt");
            ev.name = userInfo.firstName + " " +userInfo.lastName ;
        
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
            
            var showRequestModal = function(){
                $mdDialog.show({
                    scope:$scope.$new(),
                    templateUrl:'pendingRequestsModal',
                    clickOutsideToClose:true
                })
            };
                        
            var setDaysOfWeek = function(){
                 var daysOfWeek = $("#dow input:checkbox:checked").map(function(){
                        return $(this).val();
                     }).get();
                     if(daysOfWeek[0] == undefined){
                         return [ev.eventStartObj.day()];
                     }
                    return daysOfWeek ;
             };

             var setAmtOfMonths = function(){
                if(ev.repeatForm.length > 4){
                    var startMonth = ev.eventStartObj.month();
                    var endMonth = moment(ev.repeatForm, "YYYY-MM-DD", true).month();
                    if(endMonth < startMonth){
                        var lastMonth = 11 - startMonth ;
                        var amtOfMonths = lastMonth + endMonth ;
                        return amtOfMonths ;
                    }else{
                        var amtOfMonths = endMonth-startMonth
                        return amtOfMonths ;
                    }
                 }else{
                         return ev.repeatForm ;
                }
             };

            ev.createEvent = function(){
                      var today = ev.eventStartObj.format('YYYY/MM/DD').replace(/-/g, "/");
                      var eventId= ev.eventTitle + ev.eventStart;
                      var eventObj = new calendarService.Event(ev.eventTitle,ev.eventStartObj,{start:today, end:"2020/02/01"},ev.eventEndObj,eventId);
                      if(ev.dowCheckBox == true){
                            switch($("#freq").val().toLowerCase()){   
                                case "daily":       
                                        calendarService.setEventRange(ev.repeatForm, eventObj, "days");
                                        calendarService.createDailyEvent(eventObj,userEventsRef);
                                        break;
                                case "weekly":
                                        eventObj.dow = setDaysOfWeek();
                                        calendarService.setEventRange(ev.repeatForm, eventObj, "week");
                                        calendarService.createWeeklyEvent(eventObj,userEventsRef);
                                        break;
                                case "monthly": 
                                        console.log(setAmtOfMonths());
                                        calendarService.createMonthlyEvent(eventObj, userEventsRef, setAmtOfMonths());
                                        break;
                            };
                        }else{
                            calendarService.createRegularEvent(eventObj, userEventsRef)
                        }   
                        ev.dowCheckBox = false;
            };
            
            ev.deleteEvent = function(){
               if(ev.clickedEvent.recur == "monthly"){
                        ev.monthlyEvent = true ;
                    }
                    else{
                        userEventsRef.child(ev.clickedEvent.$id).remove() ;
                   
                        $("#eventDetailsModal").removeClass("showing");
                   }
            };
            
            ev.deleteSingleMonthlyEvent = function(){
                    userEventsRef.child(ev.clickedEvent.$id).remove();
                    ev.monthlyEvent = false ;
            };
            
            ev.deleteAllMonthlyEvents = function(){
                calendarService.deleteAllMonthlyEvents($scope.clickedEvent, userEventsRef);
                ev.monthlyEvent = false ;
            };
            
            ev.saveCalSettings =function(){
                calendarService.saveCalSettings(ev.calStartTime , ev.calEndTime, ev.gcalId, userCalendarRef);
                
            };

            ev.approveAppointment = function(index) {
                calendarService.approveAppointment(ev.requestsList,index ,userListRef, userEventsRef ,approvedAppointmentsRef,userInfo);
            };
               
            var setUpCalendar = function (){
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
                                    showRequestModal();
                                }
                            },
                            settingsButton: {
                                text: 'settings',
                                click: function () {
                                    showSettings()
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
//                 ev.pendingRequestButtonEvent = function (list){
//                        list.$loaded().then(function () {
//                            if (list.length != 0) {
//                                $("#pendingRequestsModal").addClass("showing");
//                            } else {
//                                alert("Sorry you have no requests");
//                            }
//                    });
//                }
            }
        }
})
.directive('viewingCal',function(){
    return{
        template:'<div class="calendar" ng-model="eventSources" id="cal" data-ui-calendar="uiConfig.calendar"></div>',
        controller: ['$scope', '$mdDialog','commonServices', 'calendarService', function ($scope, $mdDialog, commonServices, calendarService){
            $scope.examinerId = commonServices.getRouteParams().username;
            var userInfo = commonServices.getCookieObj("currentUser");
            var loggedInStudentKey = userInfo.emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '');
            var examinerRef = commonServices.getCommonRefs().usersRef.child($scope.examinerId); 
            var examinerData = commonServices.createFireObj(examinerRef);            
            var eventsRef = examinerRef.child("calendar/events");
            var settingsRef = examinerRef.child("calendar/settings");
            var eventsList = commonServices.createFireArray(eventsRef);

            examinerData.$loaded().then(function(){
                $scope.examinerName = examinerData.userData.firstName + " " + examinerData.userData.lastName ;
            });

            $scope.sendRequest = function(){
                calendarService.sendAppointmentRequest(examinerRef, userInfo,$scope.eventStart, $scope.eventEnd);
            }

            $scope.eventSources = [];
            $scope.showApptDialog = function(){
                $mdDialog.show({
                    scope:$scope.$new(),
                    clickOutsideToClose:true,
                    template:'<h2>Time</h2><br>'
                    +'<p ng-model="eventStart">{{eventStart}}</p>'
                    +'<p ng-model="eventEnd">{{eventEnd}}</p>'
                    +'<md-button  class="md-raised md-primary" ng-click="sendRequest()">Request Appointment</md-button>'
                })
            }

            $scope.uiConfig = {
                calendar: {
        //                googleCalendarApiKey: 'AIzaSyA0IwuIvriovVNGQiaN-q2pKYIpkWqSg0c',

                    events: eventsList,
                    height: '100%',
                    timezone: "local",
                    editable: true,
                    defaultView: 'agendaWeek',
                    header: {
                        left: 'month agendaWeek  agendaDay ',
                        center: 'title',
                        right: 'today prev,next settingsButton'
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
                        $scope.showApptDialog();
                        console.log('vain bane')
                    },
                    editable: false,
                    eventClick: function (event, element) {
                        // stops gcal events from going to google calendar
                          if (event.url) {
                              alert("sorry this time is not available");
                                return false;
                        }
                        alert("sorry this time is not available");
                    }
                }
            }; 
        }]
    }
})