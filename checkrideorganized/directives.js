app.directive("showmod", function(){
    return{
       link: function(scope,element,attrs){
           console.log(attrs);
           $(element).on("click", function(){
                $(scope.modalToOpen).addClass('showing');
           })
       }, 
       scope:{
            modalToOpen:"@modalToOpen"
        }
    }
});