var myApp = angular.module("examinerDirectives", []);

// the anchor tags have to be changed from local host to firebase hosting when Deploying
myApp.directive("examinerNavbar", function(){
   return{
       template:'<nav class="navbar navbar-inverse"><div class="container-fluid"><div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="#" id="userName">Brand</a></div><div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"><ul class="nav navbar-nav"><li class="active"><a href="https://checkride.firebaseapp.com/examinerFiles/examinerHomePage.html">Home <span class="sr-only">(current)</span></a></li><li><a href="https://checkride.firebaseapp.com/examinerFiles/examinerCalendar.html">Calendar</a></li><li><a http://localhost:8000/examinerFiles/messages.html">Messages</a></li><li><a href="http://localhost:8000/examinerFiles/profile.html">Profile</a></ul></div></div></nav>'
   } 
});

