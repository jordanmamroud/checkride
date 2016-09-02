
app.directive("showModal", function(){
    return{
       link: function(scope,element,attrs){
           $(element).on("click", function(){
                $(scope.modalToOpen).addClass('showing');
               console.log('ham');
           })
       }, 
       scope:{
            modalToOpen:"@modalToOpen",
            openFunc:"&"
        }
    }
});

app.directive("closeModal", function(){

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
});

app.directive("myModal", function(){
   return{
       transclude: true,
       templateUrl:"app/shared/templates/directiveTemplates/modalTemplate.html",
       scope:{
           myid:"@"
       }
   } 
});