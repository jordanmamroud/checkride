var myApp = angular.module("studentDirectives",[]);

myApp.directive('studentHeader', function(){
   return{
        template:'<nav class="navbar navbar-inverse"><div class="container-fluid"><div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="#">Checkride</a></div><div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"><ul class="nav navbar-nav"><li class="active"><a href="../StudentFiles/examinerList.html">Instructors <span class="sr-only">(current0)</span></a></li><li><a href="#"></a></li></ul></div></div></nav>'
   } 
});

//   '<nav class="navbar navbar-inverse">\
//                       <div class="container-fluid">\
//                           <div class="navbar-header">\
//                               <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>\
//                               </button>\
//                               <a class="navbar-brand" href="#" id="userName">Brand</a>\
//                           </div>\
//                           <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">\
//                               <ul class="nav navbar-nav">\
//                                   <li class="active">\
//                                       <a href="../examinerFiles/examinerHomePage.html">Home <span class="sr-only">(current)</span></a>\
//                                   </li>\
//                                   <li>\
//                                       <a href="../examinerFiles/examinerCalendar.html">Calendar</a>\
//                                   </li>\
//                                   <li>\
//                                       <a href="../examinerFiles/messages.html">Messages</a>\
//                                   </li>\
//                                   <li>\
//                                       <a href="../examinerFiles/profile.html">Profile</a>\
//                                   </li>\
//                               </ul>\
//                           </div>\
//                       </div>\
//                   </nav>'