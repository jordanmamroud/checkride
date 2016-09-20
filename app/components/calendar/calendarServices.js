(function(){

	angular.module('crCalendar.service',[])

		.service("calendarService", ['$filter', function($filter){
			 
				
			  
				var service = {
					Event:Event,
					setAmtOfMonths:setAmtOfMonths,
					setDaysOfWeek:setDaysOfWeek,
					setEventRange: setEventRange,
					onEventChange: onEventChange,
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
					deleteAllMonthlyEvents:deleteAllMonthlyEvents,
					sendAppointmentRequest:sendAppointmentRequest
				}
			return service;
			
			function Event(title,start,range,end,recur,id,dow){
				this.title=title
				this.start= start
				this.range= range
				this.end=end,
                this.recur = recur;
				this.id= id;
                this.dow = dow;
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
					moment(val,'YYYY-MM-DD hh:mm:ss').format("YYYY/MM/DD").replace(/-/g, "/");
				};
				if(val.length<4 && val.length != undefined){
					eventObj.range.end = eventObj.start.add(val, occurBy).format("YYYY/MM/DD").replace(/-/g,'/')
				};
				if(val.length == undefined){
					moment("2020/02/01",'YYYY-MM-DD hh:mm:ss').format("YYYY/MM/DD").replace(/-/g, "/");
				}
			}
            
			function onEventChange(event,ref){
				if(event.recur == 'once'){
                        console.log('ham');
						updateEvents(event, ref).updateSingleEvent();   
				 }
				if(event.recur =="weekly"){
                    console.log('bame');
					updateEvents(event, ref).updateWeeklyEvent();
				}

				if(event.recur == "monthly"){
                    console.log('wame');
					updateEvents(event,ref).updateMonthlyEvent();
				}
			}
            
			function refreshEvents(calSelector, eventSource){
					$(calSelector).fullCalendar('removeEventSource', eventSource);
					$(calSelector).fullCalendar('removeEvents');
					$(calSelector).fullCalendar('addEventSource', eventSource);
			 }
            
			function createRegularEvent(eventObj, ref){         
				 eventObj.start = eventObj.start.toISOString();
				 eventObj.end = eventObj.end.toISOString();
				 eventObj.recur="once";
				 ref.push(eventObj);      
			 }

			function createDailyEvent(eventObj, ref){ 
				eventObj.recur ="daily";
			//                eventObj.range = range ;
				eventObj.dow = [0,1,2,3,4,5,6];
				eventObj.start = new Date(eventObj.start).toTimeString().substring(0,8);
				eventObj.end = new Date(eventObj.end).toTimeString().substring(0,8);
				ref.push(eventObj);
			 }

			function createWeeklyEvent(eventObj, ref){
				 eventObj.start = new Date(eventObj.start).toTimeString().substring(0,8);
				 eventObj.end = new Date(eventObj.end).toTimeString().substring(0,8);
				 eventObj.recur="weekly" ; 
				 console.log('ban')
				 console.log(eventObj);
				 ref.push(eventObj);
			}
			function createMonthlyEvent(eventObj, ref, amtOfMonths){
				eventObj.recur = "monthly";
				for(var i =0 ; i <= amtOfMonths ;i++){
					  var newObj ={
						  title: eventObj.title,
						  recur:"monthly",
						  start: eventObj.start.clone().add(i,"month").toISOString(),
						  end: eventObj.end.clone().add(i,"month").toISOString()
					  }
					  ref.push(newObj); 
				}
			 }

			function saveCalSettings(startTime, endTime, googleCalendarId, ref){
				if($('#googleSync').prop('checked')){
					ref.child("settings").set(new CalSettings(startTime, endTime, googleCalendarId, true));
				}else{
					ref.child("settings").set(new CalSettings(startTime, endTime, googleCalendarId, false));
				}
			}

			function approveAppointment(list, index, ref, ref1, ref2, fireObj){
				var studentEmail = list[index].emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '');
				var studentRef = ref.child(studentEmail);
				var studentObj = {
						start: list[index].requestedStartTime,
						end:list[index].requestedEndTime,
						name:{first:fireObj.name.first,last:fireObj.name.last}, 
						emailAddress: fireObj.userData.emailAddress
				}

				var examinerObj = {
					start:list[index].requestedStartTime,
					end:list[index].requestedEndTime,
					emailAddress:list[index].emailAddress,
					name:{first:list[index].name.first,last:list[index].name.last},
					title: "appointment with " + list[index].name.first +" " +list[index].name.last,
					color: "red",
					eventType: "approved appointment"
				}
				studentRef.child("upcomingAppointments").push(studentObj);
				ref1.push(examinerObj);
				ref2.push(examinerObj);
				list.$remove(index);
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
						console.log("family")
						return false;
					}else{
						console.log("zanr")
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

			function deleteAllMonthlyEvents(){
				ref.once("value", function(datasnapshot){
					datasnapshot.forEach(function(childsnapshot){
						if(childsnapshot.val().title == event.title){
							ref.child(childsnapshot.key()).remove();
						}
					});
				});          
			}
			function Appointment(name,requestedStartTime, requestedEndTime, id){
				this.name = name;
				sentAt = new Date();
				this.requestedStartTime = requestedStartTime;
				this.requestedEndTime = requestedEndTime;
				this.id = id ;
			}
			function sendAppointmentRequest(ref, userInfo, eventStart,eventEnd){
				var reqKey = ref.push().key();
				var examinerRequestListRef = ref.child("appointmentRequests").push(new Appointment(userInfo.name.first+" "+userInfo.name.last,eventStart,eventEnd,userInfo.$id));
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
					  if(event.dow.length > 1){
							ref.child(event.$id).update({
									start: event.start.toString().substring(16,24),
									end: event.end.toString().substring(16,24),
									id: event.title + event.start.toString() + event.end.toString()
							});
					  }else{
						   ref.child(event.$id).update({
									dow:[event.start.day()],
									start: event.start.toString().substring(16,24),
									end: event.end.toString().substring(16,24),
									id: event.title + event.start.toString() + event.end.toString()
							});
					  }
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