(function(){
    angular.module('pcSearch.service',[])
    
    .factory('searchService', searchService);
    
    searchService.$inject = ['pcServices'];
    
    function searchService(pcServices){
        var options= {
            getCoordinates: getCoordinates,
            getDistance: getDistance,
            getMatchingAirports: getMatchingAirports,
            showError: showError
        }
        return options;
          
        function getCoordinates(address, done){
            var locationRequest= {
                url:"https://blooming-river-27917.herokuapp.com/gmapreq?url=http://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyAP1qGdGeoLizmASNHuCbBmj0A--M3T31o",
                type:"GET",
                error:function(er,arr,thr){
                    console.log(thr)
                }
            }
            $.ajax(locationRequest).done(function(response){
                done(response)
            })
        }
        
        function getDistance(lon1, lat1, lon2, lat2) {
              var R = 6371; // Radius of the earth in km
              var dLat = (lat2-lat1) * Math.PI / 180;  // Javascript functions in radians
              var dLon = (lon2-lon1) * Math.PI / 180; 
              var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                      Math.sin(dLon/2) * Math.sin(dLon/2); 
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
              var d = R * c; // Distance in km
              return d;
        }
        
        function getMatchingAirports(query, done){
             var settings = {
                  "async": true,
                  "url": "https://airport.api.aero/airport/match/"+query+ "?user_key=778ec1573f3e4555c9cb82e66f2c27bc",
                  'dataType': "jsonp",
                  "method": "GET",
                  "headers": {
                    "cache-control": "no-cache",
                    "postman-token": "061f9e93-0e70-8c49-a06c-fa8602a6c1bc"
                  }
                }
                $.ajax(settings).done(function (response){
                    done(response) ;
                });
        }   
        
        function showError(error){
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    alert( "User denied the request for Geolocation.")
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.")
                    break;
                case error.TIMEOUT:
                   alert( "The request to get user location timed out.")
                    break;
                case error.UNKNOWN_ERROR:
                    alert( "An unknown error occurred.")
                    break;
            }
        }
    }
}())