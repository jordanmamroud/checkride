(function(){
    angular.module('pcSchedulerController',[])
    
    .controller('schedulerController', scheduler);
    
    scheduler.$inject = [ "$mdMedia","$timeout", "$scope", "calendarService", "$mdDialog", "pcServices", "AuthService", "$localStorage"];

    function scheduler($mdMedia,$timeout, $scope, calendarService, $mdDialog, pcServices, AuthService, $localStorage){
        $timeout(function(){$("#cal").fullCalendar( 'changeView', "agendaWeek" )},.1);

        var refs = pcServices.getCommonRefs();
        var self = this ;
        var userId = $localStorage.currentUser.uid ;
        var dow = calendarService.setDowOptions();

        // scope variables
        self.appointmentSlot =false ;
        self.calSettings ={startTime: "00:00:00", endTime:"24:00:00", gcalId: null};
        self.changedEvent;
        self.clickedEvent= {start: null, end: null, recur: null ,rating: null, category: null}
        self.daysOfWeek = dow ;
        self.newEvent = {title: null, start: null, end: null, isAppointmentSlot: false, userId:null} ;
        self.recur= {isRepeatingEvent: false, frequency: null, recur: null};

        // firebase objs
        self.approvedAppointments = pcServices.createFireArray(calendarService.calRefs().approvedAppointmentsRef); 
        self.appointmentSlots = pcServices.createFireArray(refs.calendars.child(userId + "/appointmentSlots"))
        self.events = pcServices.createFireArray(calendarService.calRefs().userEventsRef) ;
        self.requestsList = pcServices.createFireArray(refs.userCalendar.child('appointmentRequests'));
        self.user = pcServices.createFireObj(refs.user);
      
        // scope functions
        self.approveAppointment = approveAppointment ;
        self.changeView = function(type){$("#cal").fullCalendar( 'changeView', type );};
        self.confirm = confirm ;
        self.createEvent = createEvent ;
        self.deleteEvent = deleteEvent ;
        self.deleteAppointment = deleteAppointment ;
        self.deleteSingleRecurEvent = deleteSingleRecurEvent;
        self.deleteEventSeries = deleteEventSeries;
        self.getAppointmentRequests = getAppointmentRequests;
        self.reject = reject;
        self.saveCalSettings = saveCalSettings; 
        self.updateAll = updateAll;
        self.updateSingle = updateSingle ;
       
        
        pcServices.showToastOnEvent(calendarService.calRefs().appointmentRequestsRef,"child_added");
        pcServices.orderArray(self.requestsList, "-sentAt");

        function createEvent(){
            self.newEvent.userId = self.user.$id ;
            calendarService.createEvent(self.newEvent, self.recur);
            self.recur.isRepeatingEvent = false ;
            $mdDialog.cancel();
        }

       function getAppointmentRequests(){
            if(self.requestsList.length !=0){
                showModal("pendingRequestsModal", true);
            }else{
                alert('You have no appointmentRequests')
            }
        };

        function deleteEvent(){
            if(self.clickedEvent.status){
                $mdDialog.show({
                    scope:$scope.$new(),
                    template:'<md-button ng-click="ev.deleteAppointment()">Delete Appointment</md-button>',
                    clickOutsideToClose: true
                })
            }else{
                if(self.clickedEvent.recur != "once"){
                    self.recur.isRepeatingEvent = true ;
                }else{
                    calendarService.deleteEvent(self.clickedEvent);
                    $mdDialog.cancel();
               }
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
            calendarService.confirmAppointmentChanges(self.user, self.changedEvent);
            $mdDialog.cancel();
        };

        function deleteAppointment(){
            calendarService.deleteAppointment(self.clickedEvent);
        }

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

           $("#cal").fullCalendar('addEventSource',self.appointmentSlots);
         
          console.log($(window).height());
            self.uiConfig = {
              
                calendar: {
                    contentHeight:700,
//                    googleCalendarApiKey: 'AIzaSyA0IwuIvriovVNGQiaN-q2pKYIpkWqSg0c',
                    events:self.events,

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
                                getAppointmentRequests();
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
                        console.log(event);
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
                    },
                    eventRender:function(event){
                    }
                }
            }
             if($mdMedia('xs')){
                self.uiConfig.calendar.header={  left: '',
                        center: '',
                        right: ''};
                self.uiConfig.calendar.views={week:{columnFormat:"ddd"}}
            }
        }
    }())