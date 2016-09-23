(function(){

	angular.module('crCalendar.service',[])

		.service("calendarService", ['$filter','pcServices', function($filter,pcServices){
			 
				
			  
				var service = {
					Event:Event,
					setAmtOfMonths:setAmtOfMonths,
					setDaysOfWeek:setDaysOfWeek,
					setEventRange: setEventRange,
					onEventChange: onEventChange,
                    updateAll:updateAll,
					refreshEvents: refreshEvents,
					createRegularEvent:createRegularEvent,
					createDailyEvent:createDailyEvent,
					createWeeklyEvent:createWeeklyEvent,
					createMonthlyEvent:createMonthlyEvent,
					saveCalSettings:saveCalSettings,
					approveAppointment: approveAppointment,
					syncGcal: syncGcal,
					checkDateRange: checkDateRange,
					eventClick:eventClick,
					removeEvent:removeEvent,
                    Appointment:Appointment,
					deleteAllEvents:deleteAllEvents,
					sendAppointmentRequest:sendAppointmentRequest
				}
			return service;
			
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
            
			function setAmtOfMonths(val, startObj){
				if(val.length > 4){
					var startMonth = startObj.month();
					var endMonth = moment(val, "YYYY-MM-DD", true).month();
					if(endMonth < startMonth){
						var lastMonth = 11 - startMonth ;
						var amtOfMonths = lastMonth + endMonth ;
						return amtOfMonths ;
					}else{
						var amtOfMonths = endMonth-startMonth
						return amtOfMonths ;
					}
				 }else{
						 return val;
				}
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
            
			function setEventRange(val, eventObj, occurBy){
				if(val.length>4){
					  eventObj.range.end = moment(val,'YYYY-MM-DD hh:mm:ss').format("YYYY/MM/DD").replace(/-/g, "/");
				};
				if(val.length<4 && val.length != undefined){
				    eventObj.range.end = eventObj.start.add(val, occurBy).format("YYYY/MM/DD").replace(/-/g,'/')
				};
				if(val.length == undefined){
					 eventObj.range.end = moment("2020/02/01",'YYYY-MM-DD hh:mm:ss').format("YYYY/MM/DD").replace(/-/g, "/");
				}
			}
            
			function onEventChange(event,ref, showUpdateModal){
				if(event.recur == 'once'){
                        ref.child(event.$id).update({
							title: event.title,
							start: event.start.toISOString(),
							end: event.end.toISOString(),
							id: event.title + event.start.toISOString() + event.end.toISOString()
					  });    
				 }else{
                     showUpdateModal();
                 }
			}
            
            function updateAll(event, user,ref){
                var recurEventsRef = ref.child("recurringEvents/" + event.eventKey);
                var eventsListRef = ref.child("events");
                var nsHour = event.start.toString().substring(16,18);
                var nsMinute = event.start.toString().substring(19,21);                          
                var neHour = event.end.toString().substring(16,18);
                var neMinute = event.end.toString().substring(19,21);
               
                recurEventsRef.once('value',function(snap){
                    snap.forEach(function(child){
                        eventsListRef.child(child.key()).once('value',function(childs){
                            var newStart = new moment(childs.val().start).set({hour:nsHour, minute:nsMinute})
                            var newEnd = new moment(childs.val().end).set({hour:neHour,minute: neMinute});
                            eventsListRef.child(child.key()).update({
                                start: newStart.toISOString(),
                                end: newEnd.toISOString()
                            })
                        })
                    })
                })
            }
            
            
            
			function refreshEvents(calSelector, eventSource){
					$(calSelector).fullCalendar('removeEventSource', eventSource);
					$(calSelector).fullCalendar('removeEvents');
					$(calSelector).fullCalendar('addEventSource', eventSource);
			 }
            
			function createRegularEvent(eventObj){         
				 eventObj.start = eventObj.start
				 eventObj.end = eventObj.end
				 eventObj.recur="once";
				 return eventObj ;     
			 }

			function createDailyEvent(eventObj){ 
				eventObj.recur ="daily";
			//                eventObj.range = range ;
				eventObj.dow = [0,1,2,3,4,5,6];
				eventObj.start = new Date(eventObj.start).toTimeString().substring(0,8);
				eventObj.end = new Date(eventObj.end).toTimeString().substring(0,8);
				return eventObj ;
			 }

			function createWeeklyEvent(eventObj){
				 eventObj.start = new Date(eventObj.start).toTimeString().substring(0,8);
				 eventObj.end = new Date(eventObj.end).toTimeString().substring(0,8);
				 eventObj.recur="weekly" ; 
				 return eventObj 
			}
			function createMonthlyEvent(eventObj, amtOfMonths){
				eventObj.recur = "monthly" ;
                var newEvents= [];
				for(var i =0 ; i <= amtOfMonths ;i++){
					  var newObj ={
						  title: eventObj.title,
						  recur:"monthly",
						  start: eventObj.start.clone().add(i,"month").toISOString(),
						  end: eventObj.end.clone().add(i,"month").toISOString()
					  }
					  newEvents.push(newObj);
				}
                return newEvents; 
			 }

			function saveCalSettings(startTime, endTime, googleCalendarId, ref){
				if($('#googleSync').prop('checked')){
					ref.child("settings").set(new CalSettings(startTime, endTime, googleCalendarId, true));
				}else{
					ref.child("settings").set(new CalSettings(startTime, endTime, googleCalendarId, false));
				}
			}

			function approveAppointment(apt, userInfo){
                var refs = pcServices.getCommonRefs();
                var studentRef = refs.accounts.child(apt.senderId);
                var userRef = refs.accounts.child(userInfo.$id);
                var userCalRef = refs.calendars.child(userInfo.$id);
                userCalRef.child("events/"+ apt.$id).update({
                    appointmentSlot: false,
                    color:"red",
                    rating: apt.rating,
                    category:apt.category
                })
                function newApt(user){
                     var appointment =  new Event(user.name.first+" " + user.name.last ,apt.start,null, apt.end,"once", user.$id, null, 'red', apt.category, apt.rating);
                    console.log(appointment);
                    return appointment ;
                }
             
                userCalRef.child("approvedAppointments/").child(apt.$id).set(newApt(apt));
                userCalRef.child("appointmentSlots/" + apt.$id).remove();
                studentRef.child("appointments/" + apt.$id).set(newApt(userInfo));
                refs.notifications.child(apt.senderId).push("New Appointment With " + userInfo.name.first+' ' +userInfo.name.last);
                userCalRef.child("appointmentRequests" + "/" + apt.$id).remove();
			}

			function syncGcal(userData, calendarGcalId){
				  userData.$loaded().then(function(){
					 if(userData.synced == true){
						 calendarGcalId = userData.googleCalendarId ;
						 $("#googleSync").prop("checked", true);
					 };
				 });
			}

			function checkDateRange(event){
				if(event.recur != "once" && event.hasOwnProperty("range")){
					var eventDate = moment(event.start).format("YYYY/MM/DD");
					console.log(event.range.start)
					console.log("eventDate:" + eventDate);
					console.log(event.range.end);
					if(event.range.start > eventDate || event.range.end < eventDate){
						return false ;
					}else{
						return false ;
					}
				}
			}
            
			function eventClick(event, ref1, ref2, selector){
				$("#eventTitle").text("Event: " + event.title);
				$("#eventDetailsModal #eventStart").text("start: " + event.start.toISOString());
				$("#eventDetailsModal #eventEnd").text("end: " + event.end.toISOString());
				$("#eventDetailsModal").addClass('showing');
				$("#deleteButton").unbind();
				deleteEvents.deleteEvent(event, ref1,selector);
				deleteEvents.deleteEvent(event, ref2, selector);
			}
            
			function removeEvent(event, ref){
				var eventToDelete = ref.child(event.$id) ;
				eventToDelete.remove();
			}

			function deleteAllEvents(event,ref){
                var eventsRef = ref.child("events");
                var recurEventsRef = ref.child("recurringEvents/" + event.eventKey);
                console.log(recurEventsRef.toString());
				recurEventsRef.once("value", function(data){
					data.forEach(function(child){
                        console.log('ham');
                        console.log('cd',child.key());
						eventsRef.child(child.key()).remove();
					});
				});       
			}
            
			function Appointment(name,requestedStartTime, requestedEndTime, id, category, rating){
				this.name = name;
				sentAt = new Date();
				this.requestedStartTime = requestedStartTime;
				this.requestedEndTime = requestedEndTime;
				this.id = id ;
                this.category = category;
                this.rating = rating;
			}
            
			function sendAppointmentRequest(ref, userInfo, eventStart,eventEnd){
				var reqKey = ref.push().key();
                
                console.log("iso", eventStart.toISOString());
                var appointment = new Appointment(userInfo.name.first+" "+ userInfo.name.last,eventStart.toISOString(),eventEnd.toISOString(), userInfo.$id);
				var examinerRequestListRef = ref.child("appointmentRequests").push(appointment);
			}
			
			function CalSettings(minTime, maxTime, googleCalendarId, synced) {
				this.minTime = minTime;
				this.maxTime = maxTime
				this.googleCalendarId = googleCalendarId ;
				this.synced = synced;
			}
			
			function updateEvents(event, ref){
				var methods = {
						updateSingleEvent:updateSingleEvent, 
						updateWeeklyEvent: updateWeeklyEvent,
						updateMonthlyEvent: updateMonthlyEvent
				}
				return methods;


				function updateSingleEvent(){
                    console.log(event);
					  ref.child(event.$id).update({
							title: event.title,
							start: event.start.toISOString(),
							end: event.end.toISOString(),
							id: event.title + event.start.toISOString() + event.end.toISOString()
					  }); 
				 }

				function updateWeeklyEvent(){
                        ref.child(event.$id).update({
                                start: event.start.toString(),
                                end: event.end.toString(),
                                id: event.title + event.start.toString()
                        });

                       ref.child(event.$id).update({
                                dow:[event.start.day()],
                                start: event.start.toString().substring(16,24),
                                end: event.end.toString().substring(16,24),
                                id: event.title + event.start.toString() + event.end.toString()
                        });
                  }
				

				function updateMonthlyEvent(){
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
		}]);
})()