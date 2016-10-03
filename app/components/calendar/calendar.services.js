(function(){

	angular.module('crCalendar.service',[])  
    .factory("calendarService", calendarService);
    
    calendarService.$inject = ['$filter','pcServices',"$localStorage"]
    
    function calendarService($filter,pcServices,$localStorage){
            var refs = pcServices.getCommonRefs();

      

            var service = {
               
                Appointment:Appointment,
                approveAppointment: approveAppointment,
                calRefs: calRefs,
                createEvent: createEvent,
                confirmAppointmentChanges: confirmAppointmentChanges,
                deleteEvent:deleteEvent,
                deleteEventSeries:deleteEventSeries,
                Event:Event,
                onEventChange: onEventChange,
                refreshEvents: refreshEvents,
                saveCalSettings:saveCalSettings,
                sendAppointmentRequest:sendAppointmentRequest,
                setDaysOfWeek:setDaysOfWeek,
                syncGcal: syncGcal,
                updateAll:updateAll,
                updateSingleEvent: updateSingleEvent
            }
            
			return service;
            
            function Appointment(name,start, end, senderId, category, rating){
				this.name = name;
				this.sentAt = new Date();
				this.start = start;
				this.end = end ;
				this.senderId = senderId ;
                this.category = category;
                this.rating = rating;
			}
            
            function approveAppointment(apt, userInfo){
                var refs = pcServices.getCommonRefs();
                var studentRef = refs.accounts.child(apt.senderId);
                var studentCalRef = refs.calendars.child(apt.senderId);
                var userCalRef = calRefs().userCalendarRef;
                var key = refs.user.push().key ;
                
                userCalRef.child("events/").child(key).set(newApt(apt));
                userCalRef.child("approvedAppointments/").child(key).set(newApt(apt));
                userCalRef.child("appointmentRequests/" + apt.$id).remove();
                userCalRef.child("appointmentSlots/" + apt.$id).remove();
                userCalRef.child("events/"+ apt.$id).remove();
                
                studentCalRef.child("approvedAppointments/" + apt.$id).set(newApt(userInfo));
                studentCalRef.child("events/" + apt.$id).set(newApt(userInfo));
                refs.notifications.child(apt.senderId).push("New Appointment With " + userInfo.name.first+' ' +userInfo.name.last);
                
                function newApt(user){
                     var appointment =  new Event(user.name.first+" " + user.name.last ,apt.start,null, apt.end,"once", user.$id, null, 'red', apt.category, apt.rating);
                    return appointment ;
                }
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
                     createEventAction(calRefs().userEventsRef);
                     createEventAction(calRefs().appointmentSlotsRef); 
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
                          eventObj.userId = userInfo.$id;
                          eventObj.recur = getFrequency();
                          eventObj.recurrences= setReccurence();
                             $.ajax({
                                url:"https://blooming-river-27917.herokuapp.com/recurevents",
                                dataType: "json",
                                data:JSON.stringify(eventObj),
                                type:"POST",
                                success:function(req,res){
                                }
                            });          
                        }else{
                            ref.child(eventId).set(eventObj);
                        }   
                 
                     //inner function
                    function setReccurence(){
                        if(recur.end){
                             if(recur.end.length>4){
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
                        switch(recur.frequency.toLowerCase()){
                            case "daily": return 'days';
                            case "weekly": return 'weeks' ;
                            case "monthly": return 'month' ;
                        }
                    }  
                };
            }
        
            function confirmAppointmentChanges(event){
                calRefs().userEventsRef.child(self.event.$id).update({
                    start: event.start.toString(),
                    end: event.end.toString()
                });
            }
            
            function deleteEvent(event){
                if(event.isAppointmentSlot){
                    calRefs().userEventsRef.child(event.$id).remove() ;
                    calRefs().appointmentSlotsRef.child(event.$id).remove();
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

	       function sendAppointmentRequest(userInfo, examinerInfo, clickedEvent){
                    var examinerCalRef = refs.calendars.child(examinerInfo.$id) ;
                    var name= {first: userInfo.name.first , last: userInfo.name.last}
                    var appointment = new Appointment(name,clickedEvent.start.toString(), clickedEvent.end.toString(), userInfo.$id, clickedEvent.category.$value , clickedEvent.rating.$value);

                    examinerCalRef.child("appointmentRequests/" + clickedEvent.$id).set(appointment) ;
                    refs.notifications.child(examinerInfo.$id).push("appointment Request from " + userInfo.name.first + ' ' + userInfo.name.last) ; 
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
                            calRefs().userEventsRef.child(child.key).update({
                                start: newStart.toString(),
                                end: newEnd.toString()
                            })
                            if(event.isAppointmentSlot){
                                calRefs().appointmentSlotsRef.child(child.key).update({
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
			
			function CalSettings(minTime, maxTime, googleCalendarId, synced) {
				this.minTime = minTime;
				this.maxTime = maxTime
				this.googleCalendarId = googleCalendarId ;
				this.synced = synced;
			}
    }
}())
                                     