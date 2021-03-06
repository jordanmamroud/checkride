(function(){

	angular.module('crCalendar.service',[])  
    .factory("calendarService", calendarService);
    
    calendarService.$inject = ['$filter','pcServices',"$localStorage"];
    
    function calendarService($filter,pcServices,$localStorage){
        var refs = pcServices.getCommonRefs();
        
        var service = {
            Appointment:Appointment,
            approveAppointment: approveAppointment,
            calRefs: calRefs,
            createEvent: createEvent,
            confirmAppointmentChanges: confirmAppointmentChanges,
            deleteAppointment:deleteAppointment,
            deleteEvent:deleteEvent,
            deleteEventSeries:deleteEventSeries,
            Event:Event,
            getForecast: getForecast,
            onEventChange: onEventChange,
            refreshEvents: refreshEvents,
            saveCalSettings:saveCalSettings,
            sendAppointmentRequest:sendAppointmentRequest,
            setDaysOfWeek:setDaysOfWeek,
            setDowOptions:setDowOptions,
            syncGcal: syncGcal,
            updateAll:updateAll,
            updateSingleEvent: updateSingleEvent
        }

        return service;

        function Appointment(name,start, end, appointmentWith, category, rating, color, status){
            this.name = name;
            this.sentAt = new Date();
            this.start = start;
            this.end = end ;
            this.appointmentWith = appointmentWith ;
            this.category = category;
            this.rating = rating;
            this.recur= "once"
            this.color = color; 
            this.status = status ;
        }

        function approveAppointment(aptRequest, approverInfo){
            var refs = pcServices.getCommonRefs();
            var requesterCalRef = refs.calendars.child(aptRequest.requesterId);
            var approverCalRef = calRefs().userCalendarRef;
            var key = refs.user.push().key ;

            approverCalRef.child("events/").child(key).set(newApt(aptRequest, aptRequest.requesterId));
            approverCalRef.child("approvedAppointments/").child(key).set(newApt(aptRequest, aptRequest.requesterId));
            approverCalRef.child("appointmentRequests/" + aptRequest.$id).remove();
            approverCalRef.child("appointmentSlots/" + aptRequest.$id).remove();
            approverCalRef.child("events/"+ aptRequest.$id).remove();

            requesterCalRef.child("approvedAppointments/" + key).set(newApt(approverInfo, approverInfo.$id));
            requesterCalRef.child("events/" + key).set(newApt(approverInfo, approverInfo.$id));
            requesterCalRef.child("events/"+ aptRequest.$id).remove();

            refs.notifications.child(aptRequest.requesterId).push("New Appointment With " + approverInfo.name.first+' ' +approverInfo.name.last);

            //inner function
            function newApt(user,id){
                var name = user.name.first+" " + user.name.last
                var appointment =  new Appointment( name, aptRequest.start, aptRequest.end, id, aptRequest.category, aptRequest.rating, 'red', 'confirmed');
                return appointment ;
            }         
        }

        function AppointmentRequest(name,start, end, requesterId, category, rating){
                this.name = name;
                this.sentAt = new Date();
                this.start = start;
                this.end = end ;
                this.requesterId = requesterId ;
                this.category = category;
                this.rating = rating;
                this.recur= "once"
        }

        function calRefs(){
            var refs = pcServices.getCommonRefs();
            return {
                userCalendarRef :refs.userCalendar,
                userEventsRef :  refs.userCalendar.child("events"),
                approvedAppointmentsRef : refs.userCalendar.child("approvedAppointments"),
                calendarSettings: refs.userCalendar.child("settings"),
                appointmentSlotsRef : refs.userCalendar.child('appointmentSlots'), 
                appointmentRequestsRef : refs.userCalendar.child('appointmentRequests')
            }
        }

        function createEvent(newEvent, recur){    
             var eventId = calRefs().userEventsRef.push().key ;
             if(newEvent.isAppointmentSlot && recur.isRepeatingEvent == false){
                 createEventAction(calRefs().appointmentSlotsRef);
                 createEventAction(calRefs().userEventsRef);
             }else{
                 createEventAction(calRefs().userEventsRef);
             }
             //inner function
             function createEventAction(ref){
                  var today = newEvent.start.format('YYYY/MM/DD').replace(/-/g, "/");
                  var eventObj = {
                      title: newEvent.title, 
                      start:newEvent.start.toString(), 
                      end: newEvent.end.toString(),
                      recur:'once',
                      appointmentSlot: (newEvent.isAppointmentSlot) 
                  }

                  if(recur.isRepeatingEvent){
                      eventObj.userId = newEvent.userId;
                      eventObj.recur = getFrequency();
                      eventObj.recurrences= setReccurence();
                         $.ajax({
                            url:"https://blooming-river-27917.herokuapp.com/recurevents",
                            dataType: "json",
                            data:JSON.stringify(eventObj),
                            type:"POST",
                            success:function(req,res){
                            },
                             error:function(a,b,c){
                                 console.log(c);
                             }
                        });          
                    }else{
                        ref.child(eventId).set(eventObj);
                    }   

                 //inner function
                function setReccurence(){
                    if(recur.end){
                         if(recur.end.length > 4){
                             var end = moment(recur.end,'YYYY-MM-DD hh:mm:ss');
                             var occurBy = getFrequency();
                             return end.diff(newEvent.start, occurBy);
                         }else{
                             return recur.end ;
                         }
                    }else{
                        alert("please set when you would like to stop repeating the event");
                    }
                }
                //innner function
                function getFrequency(){
                    
                    switch(recur.frequency){
                        case "daily": return 'days';
                        case "weekly": return 'weeks' ;
                        case "monthly": return 'month' ;
                        default: return 'days';
                    }
                }  
            };
        }
    // user requests a new appt if he confirms his changes to a appointment on his calendar
        function confirmAppointmentChanges(requesterInfo, event){
            var refs = pcServices.getCommonRefs();
            var requesterCalRef = refs.userCalendar;
            requesterCalRef.child("events/"+ event.$id).update({
                start: event.start.toString(),
                end: event.end.toString(),
                status:"pending",
                color:"#32CD32"
            });

            receiverAction();                
            // inner function
            function receiverAction(){
                var receiverCalRef = refs.calendars.child(event.appointmentWith);
                var requesterName = requesterInfo.name.first +" " + requesterInfo.name.last
                var newApt = 
                    new AppointmentRequest(requesterName, event.start.toString(), event.end.toString(), requesterInfo.$id, event.category, event.rating);

                receiverCalRef.child('events/'+ event.$id).update({
                    color:"#32CD32",
                    start: event.start.toString(),
                    status:"pending",
                    end: event.end.toString()
                });
                receiverCalRef.child('appointmentRequests').child(event.$id).set(newApt);
            }
        }

        function deleteAppointment(event){
            var refs = pcServices.getCommonRefs();
            var deletorRef = refs.userCalendar;
            var deleteeRef = refs.calendars.child(event.appointmentWith);

            deleteAction(deletorRef);
            deleteAction(deleteeRef);

            //inner function
            function deleteAction(userCalRef){
                var deletee = refs.calendars.child(event.appointmentWith);
                userCalRef.child("events/"+ event.$id).remove();
                userCalRef.child("approvedAppointments/"+event.$id).update({
                    status:'deleted'
                });
            }
        }

        function deleteEvent(event){
            if(event.isAppointmentSlot){
                calRefs().appointmentSlotsRef.child(event.$id).remove();
                calRefs().userEventsRef.child(event.$id).remove() ;
            }else{
                calRefs().userEventsRef.child(event.$id).remove() ;
            }
        }

        function deleteEventSeries(event){
            var recurEventsRef = calRefs().userCalendarRef.child("recurringEvents/" + event.eventKey);
            recurEventsRef.once("value", function(data){
                data.forEach(function(child){
                    if(event.isAppointmentSlot){
                        calRefs().appointmentSlotsRef.child(child.key).remove();
                        calRefs().userEventsRef.child(child.key).remove();
                    }else{
                        calRefs().userEventsRef.child(child.key).remove();
                    }
                });
            });       
        }

        function Event(title, start, range, end, recur, id, dow, color,category, rating){
            this.title=title
            this.start= start
            this.range= range
            this.end=end,
            this.recur = recur;
            this.id= id;
            this.dow = dow;
            this.color = color,
            this.category = category ;
            this.rating= rating
        }
        
        function getForecast(code, done){
            var settings = {
                url:"https://blooming-river-27917.herokuapp.com/lets?url=https://weather-qa.api.aero/weather/v1/forecast/"+ code+ "?user_key=89e15931434731aefdaa04920ec60e44",             
                type:"GET"
            }
             $.ajax(settings).done(function(res){
                 done();
             });
        }  

        function onEventChange(event){
                 calRefs().userEventsRef.child(event.$id).update({
                        title: event.title,
                        start: event.start.toISOString(),
                        end: event.end.toISOString(),
                        id: event.title + event.start.toISOString() + event.end.toISOString()
                  });    
        }

        function refreshEvents(calSelector, eventSource){
            $(calSelector).fullCalendar('removeEventSource', eventSource);
            $(calSelector).fullCalendar('removeEvents');
            $(calSelector).fullCalendar('addEventSource', eventSource);
         }


        function saveCalSettings(calSettings){
            if($('#googleSync').prop('checked')){
                calRefs().calendarSettings.set(new CalSettings(calSettings.startTime,calSettings.endTime, calSettings.googleCalendarId, true));
            }else{
                calRefs().calendarSettings.child("settings").set(new CalSettings(calSettings.startTime, calSettings.endTime, calSettings.googleCalendarId, false));
            }
        }

       function sendAppointmentRequest(requesterInfo, receiverInfo, clickedEvent){

            var receiver = refs.calendars.child(receiverInfo.$id) ;
            var requesterName = {first: requesterInfo.name.first , last: requesterInfo.name.last}
            var appointment = new AppointmentRequest(requesterName, clickedEvent.start.toString(), clickedEvent.end.toString(), requesterInfo.$id, clickedEvent.category.$value , clickedEvent.rating.$value);

            receiver.child("appointmentRequests/" + clickedEvent.$id).set(appointment) ;
            refs.notifications.child(receiverInfo.$id).push("appointment Request from " + requesterInfo.name.first + ' ' + requesterInfo.name.last) ; 
       }
        
       function setDaysOfWeek(daysOfWeek, start){
            var selectedDays=[];
            angular.forEach(daysOfWeek, function(day){
                if(day.selected){
                    selectedDays.push(day.val);
                }
            })
            if(selectedDays.length == 0){
                selectedDays.push(start.day());
                return selectedDays;
            }
            return selectedDays; 
       }    
        
       function setDowOptions(){
           var dowOptions = [{day:'sunday',val:0},{day:'monday',val:1},{day:'tuesday',val:2},{day:'wednesday',val:3},{day:'thursday',val:4},{day:'friday',val:5},{day:'saturday',val:6}];
           
           return dowOptions ;
       }

       function syncGcal(userData, calendarGcalId){
              userData.$loaded().then(function(){
                 if(userData.synced == true){
                     calendarGcalId = userData.googleCalendarId ;
                     $("#googleSync").prop("checked", true);
                 };
             });
        }

        function updateAll(event){
            var recurEventsRef = calRefs().userCalendarRef.child("recurringEvents/" + event.eventKey);
            var nsHour = event.start.toString().substring(16,18);
            var nsMinute = event.start.toString().substring(19,21);                          
            var neHour = event.end.toString().substring(16,18);
            var neMinute = event.end.toString().substring(19,21);

            recurEventsRef.once('value',function(snap){
                snap.forEach(function(child){
                    calRefs().userEventsRef.child(child.key).once('value',function(childs){
                        var newStart = new moment(childs.val().start).set({hour:nsHour, minute:nsMinute})
                        var newEnd = new moment(childs.val().end).set({hour:neHour,minute: neMinute});
                        if(event.isAppointmentSlot){
                            calRefs().appointmentSlotsRef.child(child.key).update({
                                start: newStart.toString(),
                                end: newEnd.toString()
                            })
                        }else{
                            calRefs().userEventsRef.child(child.key).update({
                                start: newStart.toString(),
                                end: newEnd.toString()
                            })
                        }
                    })
                })
            })
        }

        function updateSingleEvent(event){
            if(event.isAppointmentSlot){
                calRefs().appointmentSlotsRef.child(event.$id).update({
                    title: event.title,
                    start: event.start.toString(),
                    end: event.end.toString()
                });  
            }
            calRefs().userEventsRef.child(event.$id).update({
                title: event.title,
                start: event.start.toString(),
                end: event.end.toString()
            });  
        }

        function CalSettings(minTime, maxTime, googleCalendarId, synced) {
            this.minTime = minTime;
            this.maxTime = maxTime
            this.googleCalendarId = googleCalendarId ;
            this.synced = synced;
        }
    }
}())
                                     