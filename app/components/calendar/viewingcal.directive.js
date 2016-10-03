angular.module("calDir", ['ui.calendar', 'crCalendar.service', 'firebase'])

//.directive('calDirective', function(){
//
//    return{
//        templateUrl: function() {
//            return 'app/components/calendar/cal.html?' +  new Date();
//        },
//        controllerAs:"ev", 
//        link:function(scope,attrs){
//            
//        }
//        }
//})

.directive('viewingCal',function(){
    return{
        templateUrl:function() {
            return 'app/components/calendar/viewCal.html?' +  new Date();
        }, 
        controllerAs:'vc',
        controller: "viewingCalController"
    }
})


