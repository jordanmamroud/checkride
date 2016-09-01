var app = angular.module("checkrideApp", ['ngRoute','ui.calendar', 'firebase', 'examinerDirectives','examinerCalendar', 'loginMod',"createAccountPage",'messages', 'profile']);

// logic for showing recurring event options, put in directive
//           showRecurringEventOptions: function(){
//                      $("#dowCheckBox").on("click", function(){
//                         $("#recur").toggleClass("hide"); 
//                      });
//                        $("#freq").on("change", function(){
//                             if($("#freq").val()== "weekly"){
//                                $("#dow").removeClass("hide");
//                             }else{
//                                 $("#dow").addClass('hide');
//                             }
//                        });
//                    },


app.config(function($routeProvider){
    $routeProvider.when("/",{
        templateUrl:"app/shared/views/user/login/loginPage.html",
        controller:"LoginController",
        controllerAs:"login"

    })
    .when("/createAccount", {
        templateUrl: 'app/shared/views/user/createAccount/createAccountPage.html',
        controller:'createAccountController'
    })
    .when("/examiner/calendar",{
        templateUrl:"app/shared/views/examinerFiles/examinerCalendar/examinerCalendar.html",
        controller:"examinerCalendar"
    })
    .when("/examiner/profile", {
        templateUrl:'app/shared/views/examinerFiles/profile/profile.html',
        controller:'profileController'
    })
    .when("/student",{
        templateUrl:'app/shared/views/StudentFiles/examinerList.html',
        controller:"examinerList"
    })
    .when("/examiner/messages",{
        templateUrl:'app/shared/views/examinerFiles/messages.html',
        controller:'messagesController'
    })
   
});

