(function(){
    angular.module('pcSchedulerController',[])
    
    .controller('schedulerController', scheduler);
    
    scheduler.$inject = ["$scope", "calendarService", "$mdDialog", "pcServices","AuthService","$localStorage"];

    function scheduler($scope, calendarService, $mdDialog, pcServices,AuthService,$localStorage){
            var refs = pcServices.getCommonRefs();
            var self = this ;
            var userId = $localStorage.currentUser.uid ;
            self.weather = '';

             var settings = {
                    url:"https://blooming-river-27917.herokuapp.com/lets?url=https://weather-qa.api.aero/weather/v1/forecast/SNU?user_key=89e15931434731aefdaa04920ec60e44",             
                    type:"GET",
                    success:function(req,res){
                    },
                    error:function(er,arr,thr){
                        console.log(thr);
                    }
             }
             $.ajax(settings).done(function(res){
                 console.log(JSON.parse(res));
                 self.weather = JSON.parse(res);
             });


            var dow = [{day:'sunday',val:0},{day:'monday',val:1},{day:'tuesday',val:2},{day:'wednesday',val:3},{day:'thursday',val:4},{day:'friday',val:5},{day:'saturday',val:6}];
            
            // scope variables
            self.appointmentSlot =false ;
            self.calSettings ={startTime: "00:00:00", endTime:"24:00:00", gcalId: null};
            self.changedEvent;
            self.clickedEvent= {start: null, end: null, recur: null ,rating: null, category: null}
            self.daysOfWeek = dow ;
            self.newEvent = {title: null, start: null, end: null, isAppointmentSlot: false} ;
            self.recur= {isRepeatingEvent: false, frequency: null, recur: null};
            
            // firebase objs
            self.approvedAppointments = pcServices.createFireArray(calendarService.calRefs().approvedAppointmentsRef); 
            self.events = pcServices.createFireArray(calendarService.calRefs().userEventsRef) ;
            self.requestsList = pcServices.createFireArray(refs.userCalendar.child('appointmentRequests'));
            self.user = pcServices.createFireObj(refs.user);
        
            // scope functions
            self.createEvent = createEvent ;
            self.deleteEvent = deleteEvent ;
            self.deleteSingleRecurEvent = deleteSingleRecurEvent;
            self.deleteEventSeries = deleteEventSeries;
            self.saveCalSettings = saveCalSettings; 
            self.approveAppointment = approveAppointment ;
            self.confirm = confirm ;
            self.reject = reject;
            self.updateAll = updateAll;
            self.updateSingle = updateSingle ;
            
            pcServices.showToastOnEvent(calendarService.calRefs().appointmentRequestsRef,"child_added");
            pcServices.orderArray(self.requestsList, "-sentAt");
                
            function createEvent(){
                calendarService.createEvent(self.newEvent, self.recur);
                self.recur.isRepeatingEvent = false ;
                $mdDialog.cancel();
            }
            
           function getAppointmentRequest(){
                if(self.requestsList.length !=0){
                    showModal("pendingRequestsModal", true);
                }else{
                    alert('You have no appointmentRequests')
                }
            };
            
            function deleteEvent(){
                 if(self.clickedEvent.recur != "once"){
                        self.recur.isRepeatingEvent = true ;
                    }else{
                        calendarService.deleteEvent(self.clickedEvent);
                        $mdDialog.cancel();
                   }
            };
            
           function deleteSingleRecurEvent(){
                calendarService.deleteEvent(self.clickedEvent);
                self.recur.isRepeatingEvent = false ;
                $mdDialog.cancel();
            };
                        
           function deleteEventSeries(){
                calendarService.deleteEventSeries(self.clickedEvent);
                self.monthlyEvent = false ;
                $mdDialog.cancel();
            } ;
            
            function saveCalSettings(){
                calendarService.saveCalSettings(self.calSettings);
            };

            function approveAppointment(apt) {
                calendarService.approveAppointment(apt,self.user);
            };
               
            function confirm(){
                calendarService.confirmAppointmentChanges(self.changedEvent);
                $mdDialog.cancel();
            };
            
            function reject(){
                calendarService.refreshEvents("#cal",self.events);
                $mdDialog.cancel();
            }
        
           function updateAll(){
                calendarService.updateAll(self.changedEvent);
                $mdDialog.cancel();
            }    
            
           function updateSingle(){
                calendarService.updateSingleEvent(self.changedEvent);
                $mdDialog.cancel();
           }
            
            function setUpCalendar(){
                calendarService.calRefs().calendarSettings.on("value", function(data){
//                    ev.uiConfig.calendar.minTime = data.val().minTime ;
//                    ev.uiConfig.calendar.maxTime = data.val().maxTime ;
                });
            }
            
            function showModal(id,clickOutToClose){
                $mdDialog.show({
                    scope:$scope.$new(),
                    templateUrl:id,
                    clickOutsideToClose:clickOutToClose
                })
            }
        
            function onEventChange(event){
                 if(event.hasOwnProperty('category')){
                    showModal('warningModal', false);
                    return false;
                 }else{
                     if(event.recur != 'once'){
                            showModal('updateEventsModal', false);
                        }else{
                            calendarService.updateSingleEvent(event);
                    }
                 }
            }
        
            self.eventSources = [];
                self.uiConfig = {
                    calendar: {
    //                    googleCalendarApiKey: 'AIzaSyA0IwuIvriovVNGQiaN-q2pKYIpkWqSg0c',
                        events: self.events,       
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
                                    showModal("settingsModal", true);
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
                            showModal("addEventModal", true);
                            self.newEvent.start = start ;
                            self.newEvent.end = end ;
                        },
                        editable: true,
                        eventClick: function (event, element) {
                            self.clickedEvent = event ;
                            showModal("eventDetailsModal",true);
                        },
                        eventDrop: function ( event , element) {
                            onEventChange(event);
                        },
                        eventResizeStart:function(event){
                           self.startOfRedsize = event ;  
                        },
                        eventResize: function (event , element){
                            self.changedEvent = event ;
                            onEventChange(event);
                        }
                    }  
                }
            }
    }())