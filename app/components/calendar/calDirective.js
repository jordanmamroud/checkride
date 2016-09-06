angular.module("calDir", ['crCalendar.service', 'firebase'])

.directive('calDirective', function(){
   
    return{
        templateUrl: function() {
            return 'app/components/calendar/cal.html?' +  new Date();
        },    
        scope:{
            myid:"@",
            eventStartObj:"=",
            eventEndObj:"="
        },
        controller:function($scope, calendarService){

            var userListRef = new Firebase("https://checkride.firebaseio.com/users");
            var authData = userListRef.getAuth();           
            var userEmail = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');                        
            var userRef = userListRef.child(userEmail);
            var userCalendarRef = userRef.child("calendar");
            var userEventsRef = userCalendarRef.child("events");

          
           

            $scope.dowCheckBox= false ;
            $scope.frequency = 'daily';
            $scope.eventTitle =''; 
            $scope.endRange = '2020/11/02';
            $scope.numOccur = 0 ;


            var setDaysOfWeek = function(){
                 var daysOfWeek = $("#dow input:checkbox:checked").map(function(){
                        return $(this).val();
                     }).get();

                     if(daysOfWeek[0] == undefined){
                         return [$scope.eventStartObj.day()];
                     }
                    return daysOfWeek ;
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

            var setEventRange = function(eventObj, occurBy){
                  var today = $scope.eventStartObj.format('YYYY/MM/DD').replace(/-/g, "/");
          
                    var val = $("#repeatForm input:checkbox:checked").map(function(){
                             return $(this).val();
                    }).get();

                    eventObj.range.start = today ;
                    switch(val[0]){
                           case "endsOn":
                                 eventObj.range.end = moment($scope.endDate).format("YYYY/MM/DD").replace(/-/g,"/");    
                                 break ;
                            case "occurences":
                                eventObj.range.end = $scope.eventStartObj.add($scope.numOccur, occurBy).format("YYYY/MM/DD").replace(/-/g,'/');
                               break;
                     }
             }

                $scope.createEvent = function(){
                      var today = $scope.eventStartObj.format('YYYY/MM/DD').replace(/-/g, "/");
                      var eventId= $scope.eventTitle + $scope.eventStart;
                     var eventObj = {
                        title: $scope.eventTitle,
                        start: $scope.eventStartObj,
                        range:{start:today, end:"2020/02/01"},
                        end:$scope.eventEndObj,
                        id: eventId
                     }     
                        if($scope.dowCheckBox == true){
                            switch($("#freq").val().toLowerCase()){   
                                case "daily":       
                                        setEventRange(eventObj,"days");
                                        calendarService.createDailyEvent(eventObj,userEventsRef);
                                        break;

                                case "weekly":
                                        eventObj.dow = setDaysOfWeek();
                                        setEventRange(eventObj,"week");
                                        calendarService.createWeeklyEvent(eventObj,userEventsRef);
                                        break;

                                case "monthly": 
                                        calendarService.createMonthlyEvent(eventObj, userEventsRef, setAmtOfMonths());
                                        break;
                            };

                        }else{
                            calendarService.createRegularEvent(eventObj, userEventsRef)
                        }   
                        $scope.dowCheckBox = false;
                }
            }
    }
});