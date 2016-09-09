angular.module('crDirectives',[])

    //HEADER
    .directive('crHeader', function(){
        return{
            restrict:'E',
            templateUrl: 'app/layout/header.html',
            scope: true,
            replace:true,
            transclude: false,
            controller: 'crHeaderCtrl as header'
        };
    })


    //SIDEBAR
    .directive('crSidebar', ['commonServices', function(commonServices){
        var user = commonServices.getCookieObj('currentUser');
        var userType = user ? user.userType : null;
        
        return{
            restrict:'E',
            templateUrl: 'app/layout/sidebar.html',
            scope: true,
            transclude: false,
            controller: 'crSidebarCtrl',
            controllerAs: 'sidebar'
        }
    }])


    //FOOTER
    .directive("crFooter", function(){
        return{
            restrict:'E',
            templateUrl: 'app/layout/footer.html',
            scope: true,
            transclude: false,
            controller: 'crFooterCtrl'
        }
    })



    .directive("showModal", function(){
        return{
           link: function(scope,element,attrs){
               $(element).on("click", function(){
                    $(scope.modalToOpen).addClass('showing');
               })
           }, 
           scope:{
                modalToOpen:"@modalToOpen",
                openFunc:"&"
            }
        }
    })

    .directive("closeModal", function(){

       var linkFunction = function(scope,element, attrs){
           element.bind('click', function(){
               $('.modal').removeClass("showing");
                scope.onClose();
           })
       } 
       return{
           link: linkFunction,
           scope:{
               modalToClose:"@",
               onClose:"&"
           }
       }
    })

    .directive("myModal", function(){
       return{
           transclude: true,
           templateUrl:"app/layout/modalTemplate.html",
           controller:function($scope, $transclude){
      
           },
           scope:{
               myid:"@"
           }
       } 
    })


    .directive('crNavigation', ['crUserNavData', 'commonServices' ,function(crUserNavData, commonServices){
        return {
            template:   '<md-content>'+
                            '<md-list>' +
                                '<md-list-item ng-repeat="item in navItems">'+
                                    '<a href="{{item.path}}">{{item.title}}</a>' +
                                '</md-list-item>' +
                            '</md-list>' +
                        '</md-content>',
            scope: true,
            controller: function crNavCtrl($scope){
                $scope.navItems = function(){
                    var userType = commonServices.getCookieObj('currentUser').userType.toLowerCase();
                    switch(userType){
                        case 'examiner' : return crUserNavData.examiner;
                        case 'student' : return crUserNavData.student;
                        default : return null;
                    };
                }();
            }
        }
    }])

    .directive('accountDetails', ['commonServices','profileService',function(commonServices,profileService){
            return{
                templateUrl:"app/users/views/accountDetails.html",
                scope:false,
                controllerAs:'user',
                controller: function(){
                    var userInfo = commonServices.getCookieObj('currentUser');
                    this.firstName = userInfo.firstName ;
                    this.lastName = userInfo.lastName;
                    this.bio = userInfo.bio ;
                    this.oldPassword='';
                    this.newPassword='';
                    this.phoneNumber = userInfo.phoneNumber ;
                    this.emailAddress = userInfo.emailAddress ;
                    this.updateUser = function(ref){
                        if(this.newPassword.length>0){
                            profileService.changePassword(userRef, this.oldPassword, this.newPassword, userInfo.emailAddress)
                        }
                        ref.child("userData").update({
                            firstName: this.firstName,
                            lastName: this.lastName,
                            phoneNumber: this.phoneNumber,
                            emailAddress:this.emailAddress,
                            bio: this.bio
                        });
                    } 
            }   
        }
    }])
 .config(function($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
  });
    


