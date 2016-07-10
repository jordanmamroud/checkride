var myApp = angular.module("instructorAvailability", ['ui.calendar', 'firebase', 'studentDirectives']);

myApp.controller('mainController',['$scope',"$firebaseObject",'$firebaseArray','$compile','uiCalendarConfig',       function($scope,$firebaseObject,$firebaseArray,$compile,uiCalendarConfig){
    
    var studentsRef = new Firebase("https://checkride.firebaseio.com/student/");
    var authData = studentsRef.getAuth();
    var loggedInStudent = studentsRef.child(authData.password.email.replace(/[\*\^\.\'\!\@\$]/g , ''));
    var studentData = $firebaseObject(loggedInStudent);
    
    $scope.eventSources = [];


    // this is configuring the calendar
     $scope.uiConfig = {
                  calendar:{
                    height: '100%',
                    editable: true,
                    defaultView:'agendaWeek',
                    header:{
                      left: 'month agendaWeek  agendaDay ',
                      center: 'title',
                      right: 'today prev,next settingsButton'
                    },
                    selectable:true,
                      selectable: {
                            month: true,
                            agenda: true
                        },
                    unselectAuto:true,

                    select: function(start,end,ev){
                        $("#requestModal").css("display", "block");
                        $("#eventStart").text(start.toString());
                        $("#eventEnd").text(end.toString());
                        $("#requestButton").unbind();
                        $("#requestButton").on("click",function(){
                            requestAppointment(start,end,studentData);
                        });
                    },
                    editable:false,
                    eventClick: function(event, element){
                        alert("sorry this time is not available");
                    },
                    eventDrop: function(event,element){
                    },
                    eventResize: function(event, element){
                    },
                    eventRender: $scope.eventRender
                  }
    };
    
     // this method is what happens after the studentData has been received from firebase and adds the events and settings to the calendar
    var getExaminerData= function(data){
        data.$loaded().then(function(){
            var eventsref = new Firebase("https://checkride.firebaseio.com/users/" + data.currentExaminer +"/calendar/events");
            var settingsRef = new Firebase("https://checkride.firebaseio.com/users/" + data.currentExaminer +"/calendar/settings");
            var eventsList = $firebaseArray(eventsref);
            eventsList.$loaded().then(function(){
                $scope.eventSources.push(eventsList);
                setUpCalendar(settingsRef);
                $("#cal").fullCalendar('refetchEventSources', eventsList );
            });
        });;
    }
    getExaminerData(studentData);
    
    //gets the examiners calendar times and sets the students calendar to the same times
     var setUpCalendar = function(fireRef){
            var settings = $firebaseObject(fireRef);
            settings.$loaded().then(function(){
                if(settings.minTime != undefined ){    
                    $scope.uiConfig.calendar.minTime = settings.minTime.toString() ;
                    $scope.uiConfig.calendar.maxTime = settings.maxTime.toString();
                }
            });
     }
     
    //  requests an appointment with the examiners calendar who the student is currently viewing
    function requestAppointment(start, end, studentData){    
        var link = "mailto:" ;
   
        var examinerRequestRef = new Firebase("https://checkride.firebaseio.com/users/" + studentData.currentExaminer+"/appointmentRequests/" + studentData.userData.emailAddress.replace(/[\*\^\.\'\!\@\$]/g , ''));
        examinerRequestRef.set({
            firstName: studentData.userData.firstName,
            lastName: studentData.userData.lastName,
            emailAddress:studentData.userData.emailAddress,
            requestedStartTime: start.toString(),
            requestedEndTime: end.toString(),
        });
        closeModal()
    };
    
  var closeModal = function(){
        $(".modal").css("display", "none");
        $("span.close").on("click", function(){
             $(".modal").css("display", "none");
        });
    }                   
 }]);