angular.module('pcViewingCalController',[])

    .controller("viewingCalController", viewingCalController);
    
    viewingCalController.$inject = ["$scope", "$mdDialog", "pcServices", "calendarService","$sessionStorage","$localStorage"]
    
    function viewingCalController($scope, $mdDialog, pcServices, calendarService,$sessionStorage,$localStorage){

            function getForecast(code){
                $mdDialog.show({
                    scope: $scope.$new(),
                    templateUrl:"weatherModal",
                    clickOutsideToClose:true
                })
                var settings = {
                    url:"https://blooming-river-27917.herokuapp.com/lets?url=https://weather-qa.api.aero/weather/v1/forecast/"+ code+ "?user_key=89e15931434731aefdaa04920ec60e44",             
                    type:"GET",
                    success:function(req,res){
                    },
                    error:function(er,arr,thr){
                        console.log(thr);
                    }
                }
                 $.ajax(settings).done(function(res){
                     self.weather = JSON.parse(res);
                 });
            }  
        
   
           
            var self = this ;
            var refs = pcServices.getCommonRefs();
            var userId = $localStorage.currentUser.uid ;
            var userInfo = pcServices.createFireObj(calendarService.calRefs().userRef);
            var examinerInfo = $sessionStorage.examinerInfo;
            var examinerRef = refs.accounts.child(examinerInfo.$id) ;
            var examinerCalRef = refs.calendars.child(examinerInfo.$id) ;
            var settingsRef = examinerRef.child("calendar/settings") ;
            var eventsList = pcServices.createFireArray(examinerCalRef.child("appointmentSlots"));
           
            $scope.clickedEvent= {start:null, end:null, senderId:null, category:null, rating: null } ;
            
            self.getForecast = getForecast;
            self.aicrCats = pcServices.createFireArray(refs.root.child("config/aircraft-category"));
            self.ratings = pcServices.createFireArray(refs.root.child("config/ratings"));
            self.examinerName = examinerInfo.data.name.first +" " + examinerInfo.data.name.last ;
            self.sendRequest = sendRequest ;
            self.availableAirports = pcServices.createFireArray(refs.accounts.child(examinerInfo.$id+"/airports"));
            self.weather = '';
        
            function sendRequest(){
                console.log($scope.clickedEvent);
                calendarService.sendAppointmentRequest(userInfo, examinerInfo,$scope.clickedEvent);
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
        }