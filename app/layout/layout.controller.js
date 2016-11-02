(function(){
    angular.module('pcLayoutController',[])


	//LAYOUT CONTROLLER
	.controller('LayoutCtrl', layoutCtrl)
    
    layoutCtrl.$inject = ["$uibModal","$scope", 'pcServices', "AuthService", 'globalConst', "crUserNavData"];
    
    function layoutCtrl($uibModal, $scope, pcServices, AuthService, globalConst,crUserNavData){
        
        var layout = this ;
        var refs = pcServices.getCommonRefs();
        $scope.logoUrl = globalConst.app.logoPath ;
        $scope.user= '';
        $scope.navItems = navItems ; 
        
        layout.user =  '';
        layout.isSession = false;
        layout.isLoggedIn= false ;
        layout.showSidebar = null;
        layout.navItems= [];
        layout.toggleSidenavLeft = buildToggler('pc-sidenav-left');
        layout.toggleSidenavRight = buildToggler('pc-sidenav-right');

        layout.showNotifications= showNotifications ;
        layout.showConversations = showConversations
        layout.logout =  AuthService.logout;

     

        (function authenticate(){
            AuthService.auth.$onAuthStateChanged(function(authData){   
                if(!authData){
                    layout.isLoggedIn=false;
                    layout.user = null;
                    layout.showSidebar = false ;
                }else{
                    if(authData){
                        var notificationsListRef = pcServices.getCommonRefs().notifications.child(authData.uid);
                        var userObj =  pcServices.createFireObj(pcServices.getCommonRefs().accounts.child(authData.uid));
                        $scope.user = userObj ;
                        layout.user = userObj ;
                        layout.notifications = pcServices.createFireArray(notificationsListRef);
                        layout.showSidebar = true ;
                        layout.isLoggedIn= true ;
                    }
                }
            });  
        }())

        function navItems(role){
            switch(role){
                case 'examiner': 
                    return crUserNavData.examiner ;
                    break;
                case 'student':
                    return crUserNavData.student ;
                    break;
                default : return null ;
            };
        }
        
        function showNotifications(){
            var notificationsRef = refs.notifications.child(layout.user.$id);
            layout.notifications - pcServices.createFireArray(notificationsRef);
            $uibModal.open({
                scope: $scope.$new(),
                templateUrl:'notificationsModal'
                
            })
        };
        
        function showConversations(){
            var userConversationsRef = refs.conversations.child(layout.user.$id);
            layout.conversationsList = pcServices.createFireArray(userConversationsRef);
            console.log(layout.conversationsList)
            $uibModal.open({
                scope:$scope.$new(),
                templateUrl:"conversationsModal"
            })
        }

        function buildToggler(componentId) {
          return function() {
            $mdSidenav(componentId).toggle();
          }
        }
	}
}());

//  for payments          $window.Stripe.setPublishableKey('pk_test_2j8YR7CShHsT8eJS4R4W80s7');