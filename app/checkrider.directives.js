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
    .directive('crSidebar', ['$cookies', function($cookies){
        
        var userType = $cookies.getObject('currentUser').userData.userType;
        console.log(userType);
        
        return{
            restrict:'E',
            templateUrl: function(){
                
                switch (userType){
                        
                    case 'Examiner' : console.log(true); return 'app/layout/sidebar.html';
                    case 'Student' : return 'app/layout/studentSidebar.html';
                }
            },
            scope: true,
            transclude: false,
            controller: 'crSidebarCtrl'
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


