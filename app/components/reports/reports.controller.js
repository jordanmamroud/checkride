angular.module('pcReports.controller', [])

.controller('reportsController', reportsController);

reportsController.$inject = ["$scope", "pcServices", "$localStorage", "reportsService"];

function reportsController($scope, pcServices, $localStorage, reportsService){
    google.charts.load('current', {'packages':['corechart']});

    var self = this ;
    var refs = pcServices.getCommonRefs(); 
    var approvedAppointmentsRef = refs.calendars.child($localStorage.currentUser.uid + "/approvedAppointments");

    //scope variables
    self.dateFilterOptions = ["year",'january', 'february', 'march','april', 'may', 'june', 'july', 'august','september', 'october','november', 'december'];    
    self.selectedStatus= '';
    self.selectedMonth = null;

    // scope functions
    self.approvedAppointments =  pcServices.createFireArray(approvedAppointmentsRef) ;
    self.drawCharts = drawCharts ;
    self.filterAppts ; 

    function drawCharts(index) {
        var barChart = new google.visualization.BarChart(document.getElementById('barChart'));
        var pieChart = new google.visualization.PieChart(document.getElementById('pieChart')) ; 
        var aptStats = reportsService.getMatchingAppointments(self.approvedAppointments, index);
        var today = new Date() ;
    
        self.filterAppts = setAppointmentFilter
           
        reportsService.makeBarChart(barChart, aptStats) ;
        reportsService.makePieChart(pieChart, aptStats) ;         

        function setAppointmentFilter(apt){
           return reportsService.filterAppointments(apt, index, self.selectedStatus);
        }
    }
    
}