angular.module("pcReports.service",[] )

.factory("reportsService", reportsService);

function reportsService(){
    
    var methods = {
        filterAppointments:filterAppointments,
        makeBarChart: makeBarChart,
        makePieChart: makePieChart,
        getMatchingAppointments: getMatchingAppointments
    }
    return methods ;
    
     function filterAppointments(apt, index, selectedStatus){
        if(index == 0){
            return ;
        }
        var startMonth = moment(apt.start).month();
        if(startMonth == index - 1){
            if(selectedStatus){
                if(selectedStatus == apt.status){
                    return true ;
                }else{
                    return false;
                }
            }
            return true ;
        }else{
            return false ;
        }
    }
    
    function makeBarChart(barChart,aptStats){      
        var data = google.visualization.arrayToDataTable([
            ['Element', 'Density', { role: 'style' }],
            ["Appointments Completed",aptStats.confirmedApts, "#b87333"],
            ["Appointments Canceled", aptStats.deletedApts, "silver"],
            ["Appointments pending", aptStats.pendingApts, "silver"],    
        ]);
        var view = new google.visualization.DataView(data);
        var options = {
            title: "Your appointment statistics",
            width: 800,
            height: 400,
            bar: {groupWidth: "95%"},
            legend: { position: "none" },
        };
        view.setColumns([0, 1,
            { calc: "stringify",
            sourceColumn: 1,
            type: "string",
            role: "annotation" },2]
         );
        barChart.draw(view, options)
    }  
    
    function makePieChart(pieChart,aptStats){ 
        var chartData = new google.visualization.DataTable() ;
        var options = {
            'title':'Your appointment statistics',
            'width':400,
            'height':300
        };
        chartData.addColumn('string', 'Topping');
        chartData.addColumn('number', 'Slices');
        chartData.addRows([
        ['Deleted', aptStats.deletedApts],
        ['Confirmed', aptStats.confirmedApts],
        ['Pending', aptStats.pendingApts]
        ]);
        pieChart.draw(chartData, options);
    }
    
    function getMatchingAppointments(approvedAppointments, index){
        var deletedApts = 0 ;
        var confirmedApts = 0 ;
        var pendingApts = 0 ;
        
        if(index == 0){
            countMatches(checkStatus(obj)) ; 
        }else{
            countMatches(function(obj){
                var startMonth = moment(obj.start).month();
                if(startMonth == index -1){ 
                    checkStatus(obj) ; 
                }
            })
        }
        return {
            confirmedApts: confirmedApts,
            deletedApts: deletedApts,
            pendingApts: pendingApts
        }

        function checkStatus(obj){
            if(obj.status.toLowerCase() == 'deleted'){deletedApts++};
            if(obj.status.toLowerCase() == 'confirmed'){confirmedApts++};
            if(obj.status.toLowerCase() == 'pending'){pendingApts++}
        }

        function countMatches(func){
           approvedAppointments.forEach(function(obj){
                func(obj);
            })
        }
    }   

}