var app = angular.module("checkrideApp", ['ngRoute','ui.calendar', 'firebase', 'examinerDirectives','examinerCalendar', 'loginMod',"createAccountPage", 'profile']);

// logic for showing recurring event options, put in directive
//           showRecurringEventOptions: function(){
//                      $("#dowCheckBox").on("click", function(){
//                         $("#recur").toggleClass("hide"); 
//                      });
//                        $("#freq").on("change", function(){
//                             if($("#freq").val()== "weekly"){
//                                $("#dow").removeClass("hide");
//                             }else{
//                                 $("#dow").addClass('hide');
//                             }
//                        });
//                    },


app.config(function($routeProvider){
    $routeProvider.when("/",{
        templateUrl:"app/shared/views/user/login/loginPage.html",
        controller:"LoginController",
        controllerAs:"login"
  
    })
    .when("/createAccount", {
        templateUrl: 'app/shared/views/user/createAccount/createAccountPage.html',
        controller:'createAccountController'
    })
    .when("/examiner",{
        templateUrl:"app/shared/views/examinerFiles/examinerCalendar/examinerCalendar.html",
        controller:"examinerCalendar"
    })
    .when("/examiner/profile", {
        templateUrl:'app/shared/views/examinerFiles/profile/profile.html',
        controller:'profileController'
    })
    .when("/student",{
        templateUrl:'app/shared/views/StudentFiles/examinerList.html',
        controller:"examinerList"
    })
   
});


//
//app.controller("examinerCalendar",  ['$window','$scope', '$firebaseArray', '$firebaseObject', '$compile', 'uiCalendarConfig','commonServices',"calendarService",
//      function ($window,$scope, $firebaseArray, $firebaseObject, $compile, uiCalendarConfig, commonServices, calendarService){
//
//        var userListRef = new Firebase("https://checkride.firebaseio.com/users");
//        var authData = userListRef.getAuth();           
//        var userEmail = authData.password.email.replace(/[\*\^\.\'\!\@\$]/g, '');                        
//        var userRef = userListRef.child(userEmail);
//        var userCalendarRef = userRef.child("calendar");
//        var userEventsRef = userCalendarRef.child("events");
//        var approvedAppointmentsRef = userCalendarRef.child("approvedAppointments");
//        var calendarConfigRef = userCalendarRef.child("settings");
//        var appointmentRequestsListRef = userRef.child("appointmentRequests");                 
//        var userInfo = $firebaseObject(userRef); 
//        var calSettingsInfo = $firebaseObject(calendarConfigRef);
//        var check= [];
//        var arr= [];      
//        var events = $firebaseArray(userEventsRef);
//        var approvedApointments = $firebaseArray(approvedAppointmentsRef);
//          
//
//        // the requests list is a list of all student appointment request for the logged in examiner                             
//        $scope.requestsList = $firebaseArray(appointmentRequestsListRef);
//          
//        
//        var callFunctions = function(){
//            newRequestToast(appointmentRequestsListRef);
//            configureCalendar(userEventsRef, userListRef, approvedAppointmentsRef);
//            setUpCalendar(calendarConfigRef);
////            closeModal();
//            saveCalSettings(calendarConfigRef);
//            approveApptRequest($scope.requestsList,userListRef, userEventsRef ,approvedAppointmentsRef);
//            syncWithGcal(calSettingsInfo);
//            setNameField();
//        };
//
//        var initializeRequestsList = function(){
//            commonServices.orderArray($scope.requestsList, "-sentAt")
//        };
//
//         //shows when a new appointment request has been received                            
//         var newRequestToast = function(ref){
//             commonServices.showToastOnEvent(ref, "appointmentRequests", "child_added");
//         }
//         
//        // username object is used to set the user name in the top left corner of navbar                             
//        var setNameField = function(){        
//            commonServices.setDataField(userInfo, "#userName");
//        }
//                
//        //used to get the users gmail if they have chosen to sync with gcal                                   
//        var syncWithGcal = function(data){
//          calendarService.syncGcal(data, $scope.uiConfig.calendar.events.googleCalendarId)
//        }
//        var test=[];
//                        
//        // takes the users saved calendar settings from db and adds events in events[] to calendar  
//        var setUpCalendar = function (ref) {
//            ref.on("value", function (snapshot){
//                $("#loggedInUser").text(userEmail);
//                if(snapshot.hasChild("minTime")){
//                    var startTime = snapshot.val().minTime;
//                    var endTime = snapshot.val().maxTime;
//                    // giving owner document error
///*                    $scope.uiConfig.calendar.minTime = startTime.toString();
//                    $scope.uiConfig.calendar.maxTime = endTime.toString();*/
//                }
//            });
//        }
//                              
//
//        var onEventChange = function (event,  ref) {
//                calendarService.onEventChange(event,ref);
//        }
//        
//        var createEvent = function (start, end, ref){
//            calendarService.createEvent(start,end, userEventsRef);
//        }
//          
//        var createRecurringEvent = function(start, end,eventId){
//             calendarService.createRecurringEvent(start,end,eventId);
//        }
//
//        var createRegularEvent = function(start, end, eventId){
//            calendarService.createRegularEvent(start,end,eventId,userEventsRef);
//        }
//
//        var deleteEvent = function (event,ref) {
//            calendarService.deleteEvent(event, ref,"#deleteButton");
//        }
//
//        var saveCalSettings = function(ref){
//            $("#saveButton").on("click", function(){
//                var startTime = $("#calendarStartTime").val();
//                var endTime = $("#calendarEndTime").val();
//                var googleCalendarId = $("#googleCalendarId").val();
//                calendarService.saveCalSettings(startTime, endTime, googleCalendarId, ref);
//                console.log('hammmies')
//            });
//        }
//
//         var pendingRequestButtonEvent = function (list){
//            list.$loaded().then(function () {
//                if (list.length != 0) {
//                    $("#pendingRequestsModal").addClass("showing");
//                } else {
//                    alert("Sorry you have no requests");
//                }
//            });
//        }
//
//        var approveApptRequest = function(list, userListRef, userEventsRef,approvedAppointmentsRef){
//            $scope.approveButtonEvent = function (index) {
//                calendarService.approveAppointment(list,index, userListRef ,userEventsRef, approvedAppointmentsRef, userInfo);
//            };   
//        }
//        
//        
////        //  closes modal boxes when x button is clicked
////        var closeModal = function () {
////            $("span.close").on("click", function () {
////                $(".modal").css("display", "none");
////                $("#addEventModal").removeClass("showing");
////                $("#recur").addClass("hide");
////                $("#dowCheckBox").prop("checked", false);
////            });
////        }
//        
//        $scope.eventSources = [];
//          
//        // ui config where we set up all of our calendar configurations
//        var configureCalendar = function(userEventsRef, userListRef, approvedAppointmentsRef){
//            $scope.uiConfig = {
//                calendar: {
////                    googleCalendarApiKey: 'AIzaSyA0IwuIvriovVNGQiaN-q2pKYIpkWqSg0c',
//                    // reason why events is empty is because it needs to be added as a property to later access it to add the gcal events from settings data
//                    events: events,
//                 
//                    slotEventOverlap:false,
//                    allDayDefault: false,
//                    defaultView:"agendaWeek",
//                    timezone:"local",
//                    height: '100%',
//                    editable: true,
//                    allDaySlot:false,
//                    snapDuration:"02:00:00",
//                    customButtons: {
//                        pendingRequestsButton: {
//                            text: 'Pending Requests',
//                            click: function (){
//                                pendingRequestButtonEvent($scope.requestsList);
//                            }
//                        },
//                        settingsButton: {
//                            text: 'settings',
//                            click: function () {
//                                $("#settingsModal").addClass("showing");
//                            },
//                            buttonIcons: false,
//                            themeButtonIcons: false
//                        }
//                    },
//                    lazyFetching:true,
//                    header: {
//                        left: 'month agendaWeek  agendaDay ',
//                        center: 'title',
//                        right: 'today prev,next pendingRequestsButton settingsButton'
//                    },
//                    selectable: true,
//                    selectable: {
//                        month: true,
//                        agenda: true
//                    },
//                    unselectAuto: true,
//                    select: function (start, end, ev) {
//                        $("#addEventModal").addClass("showing");
//                        $("#eventStart").text(start.toString());
//                        $("#eventEnd").text(end.toString());
//                        $("#createEventButton").unbind();
//                        createEvent(start, end);
//                    },
//                    editable: true,
//                    eventClick: function (event, element) {
//                        calendarService.eventClick(event,userEventsRef,approvedAppointmentsRef, "#deleteButton");
//                    },
//                    eventDrop: function ( event , element) {
//                        onEventChange(event, userEventsRef);
//                    },
//                    eventResize: function (event , element) {
//                        onEventChange(event, userEventsRef);
//                    },
//                    eventRender: function(event,element,view){  
//                        calendarService.checkDateRange(event);
//                    },
//                    viewRender:function(view, element){
//                    },
//                    eventAfterAllRender:function(view){
//                        
//                    }
//                }
//            }
//        }
//
//          
//        callFunctions();
//        
//}]);


//     var updateIcsFile = function(userObj){
//               $.ajax({
//                            type: "POST",
//                            url: "https://blooming-river-27917.herokuapp.com/work",
//                            contentType:'application/json',
//                            crossDomain: true,
//                            dataType: "json",
//                            data: JSON.stringify({
//                                name:'jordan',
//                                email:"jordanmamroudgmailcom"
//                            }),
//                            error: function(XMLHttpRequest, textStatus, errorThrown){
//                                console.log(errorThrown)
//                            }
//                        }).done(function (dataObj) {
//                            alert("ajax callback response: bame");
//                        });
//        };