(function(){
    
angular.module('pcSearch.controller',[])

//SEARCH CONTROLLER
.controller('SearchCtrl', ['$location','$uibModal','$filter','$scope', '$log', '$timeout', "$firebaseArray",'examiners', 'airports', 'DataService', 'pcServices', '$sessionStorage','searchService', searchCtrl ]);

function searchCtrl($location, $uibModal, $filter,$scope, $log, $timeout, $firebaseArray,examiners, airports, DataService, pcServices,$sessionStorage, searchService) {
	var self = this;
    
    self.openUrl = function(){
        var rootRef = firebase.database().ref();
        var main = rootRef.child("fiverr");
        
        var url = window.location.href ;
        var rand = Math.floor( Math.random() * 26 ).toString();
        var timeStamp = Date.now().toString();
        var uniqueId = rand + timeStamp; 
        var newUrl = url + uniqueId ;
        main.child('urlIds').child(uniqueId).set(true);
        
    }

    
    
    
    
    
    
    
    // end fiverr project
    
    
    
	var refs = pcServices.getCommonRefs();
	var userRef = refs.accounts ;
    console.log('ham');
    //scope variables
	self.airports = ''
    self.category=null;
    self.class = null ; 
    self.fullPage = "layout-fill";
    self.hasSearch = false;
    self.isDisabled = false;
    self.lat = '' ;
    self.lng = '';    
    self.rating = null;
    self.searchInput = true ;
	self.searchText = "" ;
	self.searchBoxAlign = "center center" ;
    self.zipcode= '';
    self.user = pcServices.createFireObj(refs.user);
    
    //arrays for filters
    self.categories ={title:"categories", list:["airplane","rotocraft", "Lighter_Than_Air", "Power_lift"]};
    self.classes = {title:"classes", list:['single-engine','multiengine','land','water', 'gyroplane','helicopter','airship','free ballon']};
    self.ratings = {title:'ratings', list:['sport', 'recreational', 'private', 'commercial', 'flight instructor', 'Airline Transport Pilot']};
    self.examiners ='';

    //scope functions
    self.filtersModal= filtersModal ;
    self.filterOut = filterOut;
    self.getMatchingAirports = getMatchingAirports ; 
	self.selectedItemChange = selectedItemChange;
    self.setCoordinates = function(keyCode){if(keyCode==13){setCoordinates(self.zipcode);};};
    self.viewProfile = viewProfile;
    
    

    function createFilterFor(query){
		var lowercaseQuery = angular.lowercase(query);
		return function filterFn(airports) {
			return (airports.$id.indexOf(lowercaseQuery) === 0);
		};
	}
    
    function filtersModal(){
        $uibModal.open({
            templateUrl:"filtersModal",
            scope:$scope.$new()
        });
    };
    
    function filterOut(prop, list){
        var filteredExaminers ;
        console.log(prop);
        if(self.categories.title == list.title){setUpList(); } ;
        if(self.ratings.title == list.title){self.rating = prop } ;
        if(self.classes.title == list.title){self.class = prop } ;   
        
        
        if(self.category && self.rating){
            self.filterSubCategories = filterSubCategories;
        }
        
        //inner function
        function setUpList(){
            self.category = prop ;           
            var filteredExaminers = refs.certifications.child(self.category);
            self.examiners = pcServices.createFireArray(filteredExaminers);
            self.examiners.$loaded().then(function(){   
                var latlon = self.lat + "," + self.lng ;
                if(self.examiners.length == 0 ){
                    self.hasSearch = false ;
                }else{
                    for(var i =0; i<self.examiners.length; i++){
                        if(self.examiners.length == 0 ){
                            self.hasSearch = false ;
                            return
                        }
                        self.hasSearch = true ;
                        var distanceToUser = searchService.getDistance(self.lng,self.lat, self.examiners[i].mainAirport.lng , self.examiners[i].mainAirport.lat);
                        self.examiners[i].distance = parseFloat(distanceToUser * 0.62137).toFixed(2).toString();
                    }
                }
            });     
        }
        console.log($scope);
    }
    
    function filterSubCategories(examiner){
        self.hasSearch = false ;
        if(examiner.rating.hasOwnProperty(self.rating)){
            self.hasSearch = true ;
            if(self.class){
                return false
                for(var child in examiner.rating){
                   if(examiner.rating[child].hasOwnProperty(self.class)){
                        return true
                    }
                }
            }
            return true;
        }   
        else{
            return false
        }   
    }

    function getMatchingAirports (query) {
        searchService.getMatchingAirports(query, function(response){
            self.airports = response.airports ; 
        });
        var results = query ?  self.airports : null ;
        return results;
	}

    function selectedItemChange(item) {
		self.hasSearch = true;
		self.searchBoxAlign = "center start";
		self.fullPage = "";
        console.log(item);
        var ref = pcServices.getCommonRefs().main.child('airports/examiners/').child(item.code.toLowerCase()).orderByKey();
		pcServices.createFireArray(ref).$loaded().then(function(val){
			self.examiners = val ;
		});
	}
    
    function setCoordinates(address){
        console.log(address);
        var addressRequest = searchService.getCoordinates(address, onReqCompletion);
        function onReqCompletion(response){
            console.log(JSON.parse(response));
            var location = JSON.parse(response).results[0].geometry.location;
            self.lat = location.lat ;
            self.lng = location.lng;
        } 
    }
    
    function viewProfile(examiner){
		var examinerRef = refs.accounts.child(examiner.$id);
		examinerRef.once("value",function(data){
            $sessionStorage.examinerInfo = {$id:data.key, data:data.val()}
		});
		pcServices.changePath(pcServices.getRoutePaths().examinerInfo.path);
	}
}
})()