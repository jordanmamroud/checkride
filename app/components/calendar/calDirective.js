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
            var refs = pcServices.getCommonRefs();
            var userInfo = $scope.$parent.$resolve.user ;
            var userRef = refs.accounts.child(userInfo.$id);
            var userCalendarRef = refs.calendars.child(userInfo.$id);
            var userEventsRef =  userCalendarRef.child("events");
            var approvedAppointmentsRef = userCalendarRef.child("approvedAppointments");
            var calendarSettings= userCalendarRef.child("settings");
            var appointmentSlotsRef = userCalendarRef.child('appointmentSlots');

            ev.approvedAppointments = pcServices.createFireArray(approvedAppointmentsRef); 
            ev.requestsList = pcServices.createFireArray(userCalendarRef.child("appointmentRequests"));
            ev.appointmentSlots = pcServices.createFireArray(appointmentSlotsRef);
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
            ev.appointmentSlot =false;
            ev.repeatForm={};
            ev.dow="";
            ev.daysOfWeek = [{day:'sunday',val:0},{day:'monday',val:1},{day:'tuesday',val:2},{day:'wednesday',val:3},{day:'thursday',val:4},{day:'friday',val:5},{day:'saturday',val:6}]
            ev.events = pcServices.createFireArray(userEventsRef);
            console.log(userEventsRef.toString())
            ev.createEvent = checkEventType ;
            ev.deleteEvent = deleteEvent ;
            ev.deleteSingleMonthlyEvent = deleteSingleMonthlyEvent;
            ev.deleteAllMonthlyEvents = deleteAllMonthlyEvents;
            ev.saveCalSettings = saveCalSettings; 
            ev.approveAppointment = approveAppointment ;
            pcServices.showToastOnEvent(userCalendarRef.child("appointmentRequests"),"child_added");
            pcServices.orderArray($scope.requestsList, "-sentAt");
            ev.name = userInfo.name.first + " " +userInfo.name.last ;
            ev.confirm =confirm ;
            ev.reject = reject;
            
            function checkEventType (){
                var eventId= userRef.push().key();
                if(ev.appointmentSlot && ev.repeatingEvent== false){
                    console.log(ev.appointmentSlot);
                    createEvent(userEventsRef,eventId);
                    createEvent(appointmentSlotsRef,eventId);
                }else{
                    createEvent(userEventsRef,eventId);
                }
                ev.repeatingEvent = false ;
                $mdDialog.cancel();
            }
            
            function warningModal(){
                $mdDialog.show({
                    scope:$scope.$new(),
                    templateUrl:'warningModal',
                    clickOutsideToClose:false 
                })
            };
            
            function confirm(){
                userEventsRef.child(ev.event.$id).update({
                    start: ev.event.start.toString(),
                    end: ev.event.end.toString()
                });
            };
            function reject(){

                $mdDialog.cancel();
            }
            
            function updateEventsModal(){
                $mdDialog.show({
                    scope:$scope.$new(),
                    templateUrl:'updateEventsModal',
                    clickOutsideToClose:'true'
                })
            }
            
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

           function getFrequency(recur){
                switch(recur){
                    case "daily": return 'days';
                    case "weekly": return 'weeks' ;
                    case "monthly": return 'month' ;
                }
            }                         
                                  
             function setReccurence(){
                 if(ev.repeatForm.length>4){
                     var end = moment(ev.repeatForm,'YYYY-MM-DD hh:mm:ss');
                     var occurBy = getFrequency(ev.frequency.toLowerCase());
                     var start = ev.eventStartObj ;
                     return end.diff(start, occurBy);
                 }else{
                     return ev.repeatForm ;
                 }
            }
            
            function createEvent(ref,eventId){
                  var today = ev.eventStartObj.format('YYYY/MM/DD').replace(/-/g, "/");
                  var eventObj = {
                      title: ev.eventTitle, 
                      start:ev.eventStartObj.toString(), 
                      end: ev.eventEndObj.toString(),
                      recur:'once',
                      appointmentSlot:ev.appointmentSlot 
                  }
                  if(ev.repeatingEvent){
                      eventObj.userId = userInfo.$id;
                      eventObj.recur = getFrequency(ev.frequency.toLowerCase());
                      eventObj.recurrences= setReccurence();
                         $.ajax({
                            url:"https://blooming-river-27917.herokuapp.com/recurevents",
                            dataType: "json",
                            data:JSON.stringify(eventObj),
                            type:"POST",
                            success:function(req,res){
                                console.log("ham");
                            }
                        });          
                    }else{
                        ref.child(eventId).set(eventObj);
                    }   
            };
            
            function deleteEvent(){
                console.log(ev.clickedEvent)
                 if(ev.clickedEvent.recur != "once"){
                        ev.monthlyEvent = true ;
                    }
                    else{
                        userEventsRef.child(ev.clickedEvent.$id).remove() ;
                        $mdDialog.cancel();
                   }
            };
            
           function deleteSingleMonthlyEvent(){
                    userEventsRef.child(ev.clickedEvent.$id).remove() ;
                    ev.monthlyEvent = false ;
                    $mdDialog.cancel();
            };
                        
            
           function deleteAllMonthlyEvents(){
                calendarService.deleteAllEvents(ev.clickedEvent, userCalendarRef);
                ev.monthlyEvent = false ;
                $mdDialog.cancel();
            } ;
            
            function saveCalSettings(){
                calendarService.saveCalSettings(ev.calStartTime , ev.calEndTime, ev.gcalId, userCalendarRef);
            };

            function approveAppointment(apt) {
                calendarService.approveAppointment(apt,userInfo);
                console.log(ev.events);
            };
               
            function setUpCalendar(){
                calendarSettings.on("value", function(data){
//                    ev.uiConfig.calendar.minTime = data.val().minTime ;
//                    ev.uiConfig.calendar.maxTime = data.val().maxTime ;
                });
            }
            setUpCalendar();
            
           ev.updateAll = updateAll
           ev.updateSingle = updateSingle ;
            
            function updateAll(){
                calendarService.updateAll(ev.event,userInfo, userCalendarRef);
            }    
            
           function updateSingle(){
               userEventsRef.child(ev.event.$id).update({
                    title: ev.event.title,
                    start: ev.event.start.toISOString(),
                    end: ev.event.end.toISOString()
                });    
           }
           
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
                        },
                        editable: true,
                        eventClick: function (event, element) {
                            console.log('ev',event);
                            ev.clickedEvent = event ;
                            eventClick();
                        },
                        eventDrop: function ( event , element) {
                            calendarService.onEventChange(event, userEventsRef, updateEventsModal);
                        },
                        eventResizeStart:function(event){
                          ev.startOfResize = event ;  
                        },
                        eventResize: function (event , element){
                            ev.event = event ;
                            if(event.hasOwnProperty('category')){
                                warningModal();
                                return false;
                            }else{
                                calendarService.onEventChange(event, userEventsRef, updateEventsModal);
                           }
                        },
                        eventRender: function(event,element,view){ 

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
        controller: ['$scope', '$mdDialog','pcServices', 'calendarService',"$sessionStorage",function ($scope, $mdDialog, pcServices, calendarService,$sessionStorage){
            var refs = pcServices.getCommonRefs();
            var examinerInfo = $sessionStorage.examiner

            var userInfo = $scope.$resolve.user ;
            var examinerRef = refs.accounts.child(examinerInfo.$id) ;
            var examinerCalRef = refs.calendars.child(examinerInfo.$id) ;
            var settingsRef = examinerRef.child("calendar/settings") ;
            var eventsList = pcServices.createFireArray(examinerCalRef.child("appointmentSlots"));
           
            this.aicrCats = pcServices.createFireArray(refs.root.child("config/aircraft-category"));
            this.ratings = pcServices.createFireArray(refs.root.child("config/ratings"));
            this.aicrCategory='';
            this.rating='';
            this.examinerName = examinerInfo.data.name.first +" " + examinerInfo.data.name.last ;
            this.sendRequest = sendRequest ;
            
            function sendRequest(){
                var examinerCalRef = refs.calendars.child(examinerInfo.$id);
                var appointment ={
                    name:{
                        first:userInfo.name.first,
                        last:userInfo.name.last
                    },
                    start:$scope.clickedEvent.start.toString(),
                    end:$scope.clickedEvent.end.toString(),
                    senderId: userInfo.$id,
                    category:this.aicrCategory.$value,
                    rating: this.rating.$value
                }  
				var examinerRequestListRef = examinerCalRef.child("appointmentRequests/"+$scope.clickedEvent.$id).set(appointment);
                refs.notifications.child(examinerInfo.$id).push("appointment Request from " + userInfo.name.first + ' ' + userInfo.name.last);
                $mdDialog.hide();
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
                    lazyFetching:true,
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

                        console.log("select", start.toISOString());

                    },
                    editable: false,
                    eventClick: function (event, element){
                        $scope.clickedEvent = event;
//                        $scope.eventStart = event.start.add(4,"hours");
//                        $scope.eventEnd = event.end.add(4,"hours");
                        showApptDialog();
                        // stops gcal events from going to google calendar
                          if (event.url) {
                            console.log("event",event);
                            return false 
                        };
                    },
                    eventRender:function(event,el,view){
                 
                        
                    }
                }
            } 
        }]
    }
})