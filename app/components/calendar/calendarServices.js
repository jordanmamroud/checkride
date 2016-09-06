var app = angular.module('crCalendar.service',[]);

app.service("calendarService", ['$filter', function($filter){
       // constructor for the users calendar settings called in saveCalSettings function
        var CalSettings = function (minTime, maxTime, googleCalendarId, synced) {
            this.minTime = minTime;
            this.maxTime = maxTime
            this.googleCalendarId = googleCalendarId ;
            this.synced = synced;
        }
        
        var deleteEvents = {
             deleteMonthlyEvent:function(event, ref){
                        $('#deleteMonthlyEvent').removeClass("hide");
                        $("#oneEvent").on("click", function(){
                           var eventToDelete = ref.child(event.$id) ;
                           eventToDelete.remove();
                           
                        });
                        $("#allEvents").on("click",function(){
                            ref.once("value", function(datasnapshot){
                                datasnapshot.forEach(function(childsnapshot){
                                    if(childsnapshot.val().title == event.title){
                                        ref.child(childsnapshot.key()).remove();
                                    }
                                });
                            });
                        });
                    },
             removeEvent: function(event, ref){
                   var eventToDelete = ref.child(event.$id) ;
                   eventToDelete.remove();
            },
            
             deleteEvent: function(event, ref, selector){
                $(selector).on("click", function () {
                    if(event.recur == "monthly"){
                        deleteEvents.deleteMonthlyEvent(event,ref)
                    }
                    else{
                        deleteEvents.removeEvent(event, ref);
                   }
                });
            }
        }
        
        
        var updateEvents = function(event, ref){
        return{
             updateSingleEvent: function(){
                 console.log('ham');
             ref.child(event.$id).update({
                        title: event.title,
                        start: event.start.toISOString(),
                        end: event.end.toISOString(),
                        id: event.title + event.start.toISOString() + event.end.toISOString()
                    }); 
             },
             
             updateWeeklyEvent: function(){
                              if(event.dow.length > 1){
                                    ref.child(event.$id).update({
                                            start: event.start.toString().substring(16,24),
                                            end: event.end.toString().substring(16,24),
                                            id: event.title + event.start.toString() + event.end.toString()
                                    });
                              }else{
                                  console.log('adfasd');
                                   ref.child(event.$id).update({
                                            dow:[event.start.day()],
                                            start: event.start.toString().substring(16,24),
                                            end: event.end.toString().substring(16,24),
                                            id: event.title + event.start.toString() + event.end.toString()
                                    });
                              }
                        },
            updateMonthlyEvent: function(){
                        ref.once("value", function(datasnapshot){
                            datasnapshot.forEach(function(childsnapshot){
                                if(childsnapshot.val().title == event.title){
                                    var nsHour = event.start.toString().substring(16,18);
                                    var nsMinute = event.start.toString().substring(19,21);                          
                                    var neHour = event.end.toString().substring(16,18);
                                    var neMinute = event.end.toString().substring(19,21);
                                    var newStart = new moment(childsnapshot.val().start).set({hour:nsHour, minute:nsMinute})
                                    var newEnd = new moment(childsnapshot.val().end).set({hour:neHour,minute: neMinute});
                                    ref.child(childsnapshot.key()).update({
                                        start: newStart.toISOString(),
                                        end:newEnd.toISOString()
                                    });

                                };
                            });
                        });
                    }
            }
        }

    return{
        onEventChange: function(event,ref){
             if(event.recur == 'once'){
                    updateEvents(event, ref).updateSingleEvent();   
                }
                if(event.recur =="weekly"){
                    updateEvents(event, ref).updateWeeklyEvent();
                }
            
                if(event.recur == "monthly"){
                    updateEvents(event,ref).updateMonthlyEvent();
                }
        },
        
        refreshEvents: function(calSelector, eventSource){
            $(calSelector).fullCalendar('removeEventSource', eventSource);
            $(calSelector).fullCalendar('removeEvents');
            $(calSelector).fullCalendar('addEventSource', eventSource);
        },
        
        createRegularEvent: function(eventObj, ref){         
             eventObj.start = eventObj.start.toISOString();
             eventObj.end = eventObj.end.toISOString();
             eventObj.recur="once";
             ref.push(eventObj);      
        },
       createDailyEvent:function(eventObj, ref){ 
                eventObj.recur ="daily";
//                eventObj.range = range ;
                eventObj.dow = [0,1,2,3,4,5,6];
                eventObj.start = new Date(eventObj.start).toTimeString().substring(0,8);
                eventObj.end = new Date(eventObj.end).toTimeString().substring(0,8);
                ref.push(eventObj);
        },
       createWeeklyEvent: function(eventObj, ref){
                 eventObj.start = new Date(eventObj.start).toTimeString().substring(0,8);
                 eventObj.end = new Date(eventObj.end).toTimeString().substring(0,8);
                 eventObj.recur="weekly" ; 
                 console.log('ban')
                 console.log(eventObj);
                 ref.push(eventObj);
            },

        createMonthlyEvent:function(eventObj, ref, amtOfMonths){
                eventObj.recur = "monthly";
                var view = $("#cal").fullCalendar('getView');
                for(var i =0; i < amtOfMonths ;i++){
                      eventObj.start= new moment(eventObj.start).clone().add(i,"month").toISOString()
                      eventObj.range.end = moment(eventObj.start).add(amtOfMonths, "month").format("YYYY/MM/DD").replace(/-/g,'/')
                      eventObj.end =new moment(eventObj.end).clone().add(i,"month").toISOString()
                      eventObjrecur= "monthly";
                      ref.push(eventObj); 
            }
         },

        saveCalSettings: function(startTime, endTime, googleCalendarId, ref){
                if($('#googleSync').prop('checked')){
                    ref.child("settings").set(new CalSettings(startTime, endTime, googleCalendarId, true));
                }else{
                    ref.child("settings").set(new CalSettings(startTime, endTime, googleCalendarId, false));
                }
        },
        
        approveAppointment: function(list, index, ref, ref1, ref2, fireObj){
                var studentEmail = list[index].emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '');
                var studentRef = ref.child(studentEmail);
                var studentObj = {
                        start: list[index].requestedStartTime,
                        end:list[index].requestedEndTime,
                        firstName: fireObj.userData.firstName,
                        lastName: fireObj.userData.lastName,
                        emailAddress: fireObj.userData.emailAddress
                }
              
                var examinerObj = {
                    start:list[index].requestedStartTime,
                    end:list[index].requestedEndTime,
                    emailAddress:list[index].emailAddress,
                    firstName: list[index].firstName,
                    lastName:list[index].lastName,
                    title: "appointment with " +list[index].firstName +" " +list[index].lastName,
                    color: "red",
                    eventType: "approved appointment"
                }
                studentRef.child("upcomingAppointments").push(studentObj);
                ref1.push(examinerObj);
                ref2.push(examinerObj);
                list.$remove(index);
            },
        
        syncGcal:function(userData, calendarGcalId){
              userData.$loaded().then(function(){
                             if(userData.synced == true){
                                 calendarGcalId = userData.googleCalendarId ;
                                 $("#googleSync").prop("checked", true);
                             };
             });
        },
        
        checkDateRange: function(event){
            if(event.recur != "once" && event.hasOwnProperty("range")){
                            var eventDate = moment(event.start).format("YYYY/MM/DD");
                            console.log(event.range.start)
                            console.log("eventDate:" + eventDate);
                            console.log(event.range.end);
                            if(event.range.start > eventDate || event.range.end < eventDate){
                                console.log("family")
                                return false;
                            }else{
                                console.log("zanr")
                                return false ;
                            }
            }
        },
        
        eventClick: function(event, ref1, ref2, selector){
            console.log(event.start);
            $("#eventTitle").text("Event: " + event.title);
            $("#eventDetailsModal #eventStart").text("start: " + event.start.toISOString());
            $("#eventDetailsModal #eventEnd").text("end: " + event.end.toISOString());
            $("#eventDetailsModal").addClass('showing');
            $("#deleteButton").unbind();
        
            deleteEvents.deleteEvent(event, ref1,selector);
            deleteEvents.deleteEvent(event, ref2, selector);
        }
    }
}]);
