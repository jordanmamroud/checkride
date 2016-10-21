(function(){
    angular.module("pcStudentControllers",[])


    .controller('examinerListController', examinerListCtrl)
    .controller('examinerInfoController', examinerInfoCtrl)
        
    examinerListCtrl.$inject = ["$scope",'$location','pcServices',"$sessionStorage"];
    examinerInfoCtrl.$inject = ['$scope', 'pcServices',"$sessionStorage"];
    

    function examinerListCtrl($scope, $location, pcServices, $sessionStorage){
        var vm = this ;
        var refs= pcServices.getCommonRefs(); 

        vm.examiners = pcServices.createFireArray(refs.examiners);

        vm.viewProfile  = viewProfile ;
        
        function viewProfile(examiner){
            var examinerRef = refs.accounts.child(examiner.$id);
            examinerRef.once("value",function(data){
                $sessionStorage.examinerInfo = {$id:data.key, data:data.val()}
                pcServices.changePath(pcServices.getRoutePaths().examinerInfo.path);
            });
        }    
    }
    
    function examinerInfoCtrl($scope, pcServices,$sessionStorage){
        var vm = this ; 
        var refs = pcServices.getCommonRefs();
        
        vm.examinerInfo = $sessionStorage.examinerInfo ;
        vm.airportList = pcServices.createFireArray(refs.accounts.child(vm.examinerInfo.$id +"/airports"));
        vm.certificationsList = pcServices.createFireArray(refs.accounts.child(vm.examinerInfo.$id +"/certifications"));
    }
   
}());