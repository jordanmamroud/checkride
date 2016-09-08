angular.module('crDirectives',['ngCookies'])



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
        return{
            restrict:'E',
            templateUrl: function(){
                switch (userType.toLowerCase()){      
                    case 'examiner' : 
                        return 'app/layout/sidebar.html';
                        
                    case 'student' : 
                        return 'app/layout/sidebar.html';
                }
            },
            scope:false,
            transclude: false,
            controller:function($scope){
////                console.log($scope);
//                var sb = this;
//                sb.studentView = false ;
//                sb.examinerView =false;
//                
//                if(userType == 'Examiner'){
//                    sb.examinerView = true ;
//                    sb.studentView = false ;
//                }
//                if(userType == 'Student'){
//                    sb.studentView =true ;
//                    sb.examinerView = false ;
//                }
            },
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

//    .directive("myModal", function(){
//       return{
//           transclude: true,
//           templateUrl:function(){
//               return "app/layout/modalTemplate.html?" +new Date();   
//           },
//           controller:function($scope, $transclude){
//      
//           },
//           scope:{
//               myid:"@"
//           }
//       } 
//    })

    .directive("myModal", function(){
       return{
           transclude: true,
           templateUrl:function(){
               return "app/layout/modalTemplate.html?" +new Date();   
           },
           controller:function($scope, $transclude){
      
           },
           scope:{
               myid:"@"
           }
       } 
    })


