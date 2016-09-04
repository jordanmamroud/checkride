var myApp = angular.module("instructorAvailability", ['ui.calendar', 'firebase', 'studentDirectives']);


myApp.controller('mainController', ['$scope', "$firebaseObject", '$firebaseArray', '$compile', 'uiCalendarConfig', function ($scope, $firebaseObject, $firebaseArray, $compile, uiCalendarConfig) {
    
    var methods = StudentFunctions();
    var examinerId = methods.getVarFromURL();
    
    var studentsRef = new Firebase("https://checkride.firebaseio.com/student/");
    var authData = studentsRef.getAuth();
    var loggedInStudent = studentsRef.child(authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, ''));
    var studentData = $firebaseObject(loggedInStudent);
    var examinerRef = new Firebase("https://checkride.firebaseio.com/users/" + examinerId); 
    var examinerData = $firebaseObject(examinerRef);
    var examinerCalendarRef = examinerRef.child("calendar");
    var eventsref =examinerCalendarRef.child("events");
    var appointmentsRef = examinerCalendarRef.child("approvedAppointments");
    var settingsRef = examinerCalendarRef.child("settings");
    var eventsList = $firebaseArray(eventsref);
    var approvedAppointmentsList = $firebaseArray(appointmentsRef);
    
    
    var callFunctions = function(){
        // calls requestAppointment();
        configureCalendar();
        // calls sendText();
        setUpMessaging(studentData, examinerRef);
        goToInfoPage();
        // calls methods.sendTextOnClick() setUpCalendar() which calls syncGcalEvents();
        callExaminerDataFuncs();
        methods.closeModal();
    }
    
    var setUpMessaging = function(fireObj, fireRef){
        methods.showModalOnClick("#messageButton", "#messageModal");
        fireObj.$loaded().then(function(){
            var sender = fireObj.userData.firstName+" " + fireObj.userData.lastName ;
            methods.sendMessageOnClick("#sendButton", fireRef, sender);
        });
    };
    
    var goToInfoPage = function(){
        methods.newWindowOnClick("#infoPage", "../StudentFiles/viewProfileFiles/examinerInfo.html?username=" + examinerId);
    };
        
    // syncs examiners gcal events if they are synced with google calendar
    var syncGcalEvents = function(){
                if(examinerData.calendar.settings.synced == true){
                    $scope.uiConfig.calendar.events.googleCalendarId = examinerData.calendar.settings.googleCalendarId ;
                    };
    };
    
    //gets the examiners calendar times and sets the students calendar to the same times
    var setUpCalendar = function (fireObj) {
            $scope.eventSources.push(eventsList, approvedAppointmentsList);
            $("#cal").fullCalendar('refetchEventSources', eventsList);
             syncGcalEvents();
            if (fireObj.calendar.settings.minTime != undefined) {
                    $scope.uiConfig.calendar.minTime = fireObj.calendar.settings.minTime.toString();
                    $scope.uiConfig.calendar.maxTime = fireObj.calendar.settings.maxTime.toString();
                }
    }

    var callExaminerDataFuncs = function(){
        examinerData.$loaded().then(function(){
            setUpCalendar(examinerData);
            methods.sendTextOnClick("#sendButton", {
//               name: examinerData.userData.firstName,
               name:"guess who it is",
               phoneNumber: "7325704291"
            });
        });
    }
    

    //  requests an appointment with the examiners calendar who the student is currently viewing, called in calendar.select function
    function requestAppointment(start, end, fireObj) {
        var link = "mailto:";
        var examinerRequestListRef = examinerRef.child("appointmentRequests/" + fireObj.userData.emailAddress.replace(/[\*\^\.\'\!\@\$]/g, ''));
        examinerRequestListRef.set({
            firstName: fireObj.userData.firstName,
            lastName: fireObj.userData.lastName,
            emailAddress: fireObj.userData.emailAddress,
            sentAt: new Date(Date.now()).toString(),
            requestedStartTime: start.toString(),
            requestedEndTime: end.toString(),
        });
    };
    
    
 // this is configuring the calendar
    var configureCalendar = function(){
    $scope.eventSources = [];
        $scope.uiConfig = {
            calendar: {
                googleCalendarApiKey: 'AIzaSyA0IwuIvriovVNGQiaN-q2pKYIpkWqSg0c',
                // reason why events is empty is because it needs to be added as a property to later access it to add the gcal events from settings data
                events: {},
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
                    $("#requestModal").css("display", "block");
                    $("#eventStart").text(start.toString());
                    $("#eventEnd").text(end.toString());
                    $("#requestButton").unbind();
                    $("#requestButton").on("click", function () {
                        $("#requestModal").css("display", "none");
                        requestAppointment(start, end, studentData);
                    });
                },
                editable: false,
                eventClick: function (event, element) {
                    // stops gcal events from going to google calendar
                      if (event.url) {
                          alert("sorry this time is not available");
                            return false;
                    }
                    alert("sorry this time is not available");
                },
                eventDrop: function (event, element) {},
                eventResize: function (event, element) {},
                eventRender: $scope.eventRender
            }
        };
    }
    
    callFunctions();
 }]);






//    var goToInfoPage = function(){
//        $("#infoPage").on("click", function(){
//            window.location.href = "http://localhost:8000/Desktop/HTML%26CSS%26JSProjects/CheckRide/StudentFiles/viewProfileFiles/examinerInfo.html" + queryString ;  
//        });
//    }
//    



//    // shows the the message modal
//    var showMessageModal = function () {
//        $("#messageButton").on("click", function () {
//            $("#messageModal").css("display","block");
//        });
//    }



   
    // sends a message to the examiner whos profile is being viewed also if that examiner has text notications on it sends a message to there cell phone
//    var sendMessage = function (ref, fireObj){
//        $("#sendButton").on("click", function (){
//            
//                var sender = fireObj.userData.firstName + " " + fireObj.userData.lastName
//                var convoRef = ref.child("conversations/" + sender);
//                var messageRef = ref.child("messages");
//                // adds list of messages in each conversation
//                convoRef.push({
//                    subject: $("#messageModal #messageSubject").val(),
//                    body: $("#messageModal #messageBody").val(),
//                    sender: studentData.userData.firstName + " " + sender,
//                    opened: false
//                });
//                
//                // adds to list of all messages
//                messageRef.push({
//                    subject: $("#messageModal #messageSubject").val(),
//                    body: $("#messageModal #messageBody").val(),
//                    sender: studentData.userData.firstName + " " + sender,
//                    opened: false
//                });
//                sendText();
//            $("#messageModal").css("display", "none");
//        });
//    }
// 
 
//    var sendText = function(){
//             // this sends a request to the server to send a text message to the examiners phone   
//                    $.ajax({
//                        type: "POST",
//                        url: "http://localhost:1337/messages",
//                        crossDomain: true,
//                        dataType: "json",
//                        data: JSON.stringify({
//                            name: "jordan",
//                            phoneNumber: "7328413268"
//                        })
//                    }).done(function (data) {
//                        alert("ajax callback response:" + JSON.stringify(data));
//                    });
//    }
//    
    
 
    

//    
//    // loads examiners events from firebase and adds the events and settings to the calendar, alls syncs with there gcal events if they have it synced
//    var getExaminerData = function (data){
////            var eventsref = new Firebase("https://checkride.firebaseio.com/users/" + examinerId + "/calendar/events");
////            var appointmentsRef = new Firebase("https://checkride.firebaseio.com/users/" + examinerId+ "/calendar/approvedAppointments");
////            var settingsRef = new Firebase("https://checkride.firebaseio.com/users/" +examinerId + "/calendar/settings");
////            var eventsList = $firebaseArray(eventsref);
////            var approvedAppointmentsList = $firebaseArray(appointmentsRef);
//
//            $scope.eventSources.push(eventsList, approvedAppointmentsList);
//            setUpCalendar(settingsRef);
//            $("#cal").fullCalendar('refetchEventSources', eventsList);
//            
//             syncGcalEvents();
//    }
//    
    //  requests an appointment with the examiners calendar who the student is currently viewing
//    function requestAppointment(start, end, studentData) {
//        var link = "mailto:";
//        var examinerRequestListRef = new Firebase("https://checkride.firebaseio.com/users/" + studentData.currentExaminer + "/appointmentRequests/" + studentData.userData.emailAddress.replace(/[\*\^\.\'\!\@\$]/g, ''));
//        examinerRequestListRef.set({
//            firstName: studentData.userData.firstName,
//            lastName: studentData.userData.lastName,
//            emailAddress: studentData.userData.emailAddress,
//            requestedStartTime: start.toString(),
//            requestedEndTime: end.toString(),
//        });
//    };
//    