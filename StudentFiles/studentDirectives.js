var myApp = angular.module("studentDirectives",[]);

myApp.directive('studentHeader', function(){
   return{
       template: '<nav class="navbar navbar-inverse"><div class="container-fluid"><div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="#">Checkride</a></div><div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"><ul class="nav navbar-nav"><li class="active"><a href="https://checkride.firebaseapp.com/StudentFiles/examinerList.html">Instructors <span class="sr-only">(current)</span></a></li><li><a href="#"></a></li></ul></div><!-- /.navbar-collapse --></div><!-- /.container-fluid --></nav>'
   } 
});