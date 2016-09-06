angular.module('crDirectives',[])



    //DIRECTIVES
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
    .directive('crSidebar', function(){
        return{
            restrict:'E',
            templateUrl: 'app/layout/sidebar.html',
            scope: true,
            transclude: false
        }
    })
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


