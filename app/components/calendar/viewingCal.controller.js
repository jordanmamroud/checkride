angular.module('pcViewingCalController',[])

    .controller("viewingCalController", viewingCalController);
    
    viewingCalController.$inject = ["$timeout","$mdMedia","$scope", "$mdDialog", "pcServices", "calendarService","$sessionStorage","$localStorage"]
    
    function viewingCalController($timeout, $mdMedia, $scope, $mdDialog, pcServices, calendarService, $sessionStorage, $localStorage){
        
        $timeout(function(){$("#cal").fullCalendar( 'changeView', "agendaWeek" )},.1);
        getForecast("abe");
        
        var self = this ;
        var refs = pcServices.getCommonRefs();
        var userId = $localStorage.currentUser.uid ;
        var userInfo = pcServices.createFireObj(refs.user);
        var examinerInfo = $sessionStorage.examinerInfo;
        var examinerRef = refs.accounts.child(examinerInfo.$id) ;
        var examinerCalRef = refs.calendars.child(examinerInfo.$id) ;
        var settingsRef = examinerRef.child("calendar/settings") ;
        var eventsList = pcServices.createFireArray(examinerCalRef.child("appointmentSlots"));
        
        self.aicrCats = pcServices.createFireArray(refs.root.child("config/aircraft-category"));
        self.availableAirports = pcServices.createFireArray(refs.accounts.child(examinerInfo.$id+"/airports"));
        self.clickedEvent= {start:null, end:null, senderId:null, category:null, rating: null } ;
        self.examinerName = examinerInfo.data.name.first +" " + examinerInfo.data.name.last ;
        self.ratings = pcServices.createFireArray(refs.root.child("config/ratings"));
        self.weather = '';
        
        self.changeView = changeView ;
        self.sendRequest = sendRequest ;
        self.showForecast = showForecast;
    

        function changeView(){
            $("#cal").fullCalendar( 'changeView', type )
        }
        
        function getForecast(code){
            calendarService.getForecast(code, function(){
                self.weather = JSON.parse(res);
            })
        }  
    
        function sendRequest(){
            calendarService.sendAppointmentRequest(userInfo, examinerInfo,self.clickedEvent);
            $mdDialog.hide();
        }
        
        function showApptDialog (){
            $mdDialog.show({
                scope:$scope.$new(),
                templateUrl:"requestModal",
                clickOutsideToClose:true,
            })
        }
        
        function showForecast(code){
            getForecast(code)
             $mdDialog.show({
                scope: $scope.$new(),
                templateUrl:"weatherModal",
                clickOutsideToClose:true
            })
        }

        self.uiConfig = {
            calendar: {
    //                googleCalendarApiKey: 'AIzaSyA0IwuIvriovVNGQiaN-q2pKYIpkWqSg0c',

                events: eventsList,
                height: '100%',
                contentHeight:700,
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
                    alert('sorry time not available');
                },
                editable: false,
                eventClick: function (event, element){
                    self.clickedEvent = event;
                    showApptDialog();
                    // stops gcal events from going to google calendar
                      if (event.url) {
                        return false 
                    };
                }
            }
        } 
        
        //calendar config for mobile
          if($mdMedia('xs')){
            self.uiConfig.calendar.header={
                left: '',
                center: '',
                right: ''
            };
            self.uiConfig.calendar.views={week:{columnFormat:"ddd"}}
        }
    }