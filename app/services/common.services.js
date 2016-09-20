(function(){
	angular.module('pcServices', [])


	.service("pcServices", ['RoutePaths',"$location",'$routeParams','$timeout',"$firebaseArray","$firebaseObject", '$filter', '$cookies','firebaseRefs',
		function(RoutePaths,$location, $routeParams, $timeout,$firebaseArray, $firebaseObject, $filter, $cookies,firebaseRefs){

		return{
			
			firebaseRef: function(){
				return new Firebase(globalConst.firebase.ref);
			},

			getRoutePaths:function(){
				return RoutePaths
			},
	        
			changePath: function(urlString){
					$timeout(function(){
							 $location.path(urlString)
						},1);
			},
	        
			getPath:function(){
				return $location.path();
			},
			
			orderArray: function(list, orderBy){
				list = $filter('orderBy')(list, orderBy);
			},
			
			showToastOnEvent: function(ref,event){
				ref.on(event, function (datasnapshot){
							$('.toast').fadeIn(400).delay(3000).fadeOut(400);
				});
			},
			
			getCookie: function(key){
				return $cookies.get(key);
			},
			
			getCookieObj: function(key){
				return $cookies.getObject(key);  
			},
			
			setCookie: function(key){
				return $cookies.set(key);//This sets strings  
			},
			
			setCookieObj:function(key, obj){
				$cookies.putObject(key, obj);//This sets objects
			},
			removeCookieObj: function(key){
				$cookies.remove(key);
			},
			createFireObj: function(ref){
				return $firebaseObject(ref)
			},
			
			createFireArray: function(ref){
				return $firebaseArray(ref);
			},
			createLoadedFireArray:function(ref){
				$firebaseArray(ref).$loaded().then(function(){
					console.log('ham');
					return $firebaseArray(ref);
				})
			},
			getRouteParams:function(){
				return $routeParams ;
			},
			getCommonRefs:function(){
				return firebaseRefs();
			},

			objToArray: function(object, arrayType){
				var array = [];

				angular.forEach(object, function(value, key){
					switch(arrayType){
						case "key" : this.push(key)
							break;
						case "value" : this.push(value)
							break;
						default : this.push(key + ": " + value)
							break;
					}
					
				},array);
				return array;
			}
		}
	}])
})()